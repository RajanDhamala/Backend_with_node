import {asyncHandeler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken= async (userId)=>{
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate access and refresh tokens using the user model methods
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refreshToken in the user's document
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
} catch (error) {
    throw new ApiError(500, error.message);
   }
}


const registerUser = asyncHandeler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    console.log("email is", email);
    console.log("password is", password, fullName);

    // Validate that all required fields are filled
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Please fill all fields");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw new ApiError(400, "Email or username already exists");
    }

    // Get the local paths for uploaded images, if any
    const avatarLocalPath = req.files?.avatar ? req.files.avatar[0].path : null;
    const coverImageLocalPath = req.files?.coverImage ? req.files.coverImage[0].path : null;

    let avatar = null;
    let coverImage = null;

    // Upload images to Cloudinary only if they are provided
    if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
            throw new ApiError(500, "Failed to upload avatar image");
        }
    }

    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
        if (!coverImage) {
            throw new ApiError(500, "Failed to upload cover image");
        }
    }

    // Create the user in the database
    const user = await User.create({
        fullName,
        avatar: avatar ? avatar.url : "", // Use the uploaded URL or an empty string
        coverImage: coverImage ? coverImage.url : "", // Use the uploaded URL or an empty string
        email,
        password,
        username: username.toLowerCase()
    });

    console.log("user is", user);
    console.log("file data", req.files);
    console.log("req body data", req.body);

    // Find the created user, excluding password and refreshToken
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }
    
    console.log("createdUser is", createdUser);

    // Respond with the created user data
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});



const loginUser=asyncHandeler (async(req,res)=>{
    //re body se data lao
    //if username password email valid
    //check if username/email alreaddye exist
    //find the user and check password#
    //if password right give access and refresh token
    // send cookie and success response

    const{username,password}=req.body;
    console.log("username is",username,"password is",password);
    if (!username){
        throw new ApiError(400,"invalid username")
    }
   const user = await User.findOne({
        $or:[{username}]
    })
    
    if(!user){
        throw new ApiError(404,"User doesnot exist")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials")
    }

    const {accessToken , refreshToken}=await generateAccessAndRefreshToken(user._id)

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true,}

        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,{
                    user:loggedInUser,accessToken,refreshToken
                },
                "User logged in successfully"
            )
        )
})

const logoutUser=asyncHandeler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set:{refreshToken:undefined}
    })
    const options={
        httpOnly:true,
        secure:true,}

        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(
            new ApiResponse(200, {},"User logged out successfully")
        )
})

const refreshAccessToken=asyncHandeler(async(req,res)=>{
    const incommingRefreshToken=req.cookies.refreshToken || req.body.refreshToken;

    if(!incommingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }

   try {
     const decodedToken=jwt.verify()
     (incommingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET)
 
     const user=await User.findById(decodedToken?._id)
 
     if(!user){
         throw new ApiError(404,"invalid access token")
     }
 
     if(incommingRefreshToken!==user.refreshToken){
         throw new ApiError(401,"refresh token exppired or used")
     }
 
     const options={
         httpOnly:true,
         secure:true,}
 
         const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
 
         return res.status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", newRefreshToken, options)
         .json(
           new ApiResponse(
             200,
             {
               accessToken,
               refreshToken: newRefreshToken
             },
             "Access token refreshed successfully"
           )
         );
       
   } catch (error) {
    throw new ApiError(401,"invalid refresh token")
   }
        
}
)



export { registerUser
    ,loginUser
    ,logoutUser
    ,refreshAccessToken
 };
