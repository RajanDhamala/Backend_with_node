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

const changeCurrentPassword=asyncHandeler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body;

    console.log("old password is",oldPassword,"new password is",newPassword);

    if(!oldPassword || !newPassword){
        throw new ApiError(400,"Please provide current and new password")
    }

    const user=await User.findById(req.user._id)
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect){
        throw new ApiError(401,"Invalid password")
    }

    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res.
    status(200).
    json(
        new ApiResponse(200 ,{},"password changed successfully")
    )  
})

const getCurrentUser=asyncHandeler(async(req,res)=>{
    return res.status(200).$orjson(
        200,req.user ,"current fetched successfully"
    )
})

const updateAccountDetails=asyncHandeler(async(req,res)=>{
    const {fullName,email}=req.body;

    if(!fullName || !email){
        throw new ApiError(400,"Please provide full name and email")
    }
    const user=User.findByIdAndUpdate(
        req.user?._id
    ,{
        $set:{
            fullName,
            email:email
        }
    }
,{new:true}).select("-password")//returns data after update
    
return res.status(200).json(
    new ApiResponse(
        200,user,"Account details updated successfully"
    )
)
});

const updateUserAvatar = asyncHandeler(async (req, res) => {
    // Extract the local path of the uploaded avatar image
    const avatarLocalPath = req.file?.path;

    // Check if the avatar image is provided
    if (!avatarLocalPath) {
        throw new ApiError(400, "Please provide an avatar image");
    }

    // Upload the avatar image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    // Check if the avatar upload was successful
    if (!avatar.url) {
        throw new ApiError(500, "Error while uploading avatar");
    }

    // Update the user's avatar URL in the database
    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password");

    // Respond with a success message
    return res.status(200).json(
        new ApiResponse(
            200, updatedUser, "Avatar updated successfully"
        )
    );
});

const updateUserCoverImage = asyncHandeler(async (req, res) => {
    // Extract the local path of the uploaded cover image
    const coverImageLocalPath = req.file?.path;

    // Check if the cover image is provided
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Please provide a cover image");
    }

    // Upload the cover image to Cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // Check if the cover image upload was successful
    if (!coverImage.url) {
        throw new ApiError(500, "Error while uploading cover image");
    }

    // Update the user's cover image URL in the database
    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    ).select("-password");

    // Respond with a success message
    return res.status(200).json(
        new ApiResponse(
            200, updatedUser, "Cover image updated successfully"
        )
    );
});


const getUserChannelProfile=asyncHandeler(async(req,res)=>{
    const {username}=req.params

    if(!username){
        throw new ApiError(400,"Please provide a username")
    }

    const channel= await User.aggregate([{
        $match:{
            username:username?.toLowerCase()
        }
    },{
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        }
    ]) 


})

export { registerUser
    ,loginUser
    ,logoutUser
    ,refreshAccessToken
    ,getCurrentUser,
    changeCurrentPassword
    ,updateUserAvatar
    ,updateUserCoverImage
    ,updateAccountDetails
    ,getUserChannelProfile
 };
 