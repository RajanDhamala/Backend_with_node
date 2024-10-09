import {asyncHandeler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken= async (userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=user.generateAccessAndRefreshToken()
        const refreshToken=user.generateAccessAndRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false}) 
        return {accessToken,refreshToken}

    }catch(error){
        throw new ApiError(500,"Failed to generate tokens")
    }
}

const registerUser = asyncHandeler(async (req, res) => {

    const {fullName,email,username,password}=req.body
    console.log("email is",email)
    console.log("password is",password ,fullName)

    if(
        [fullName,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"Please fill all fields")
    }
    const existedUser= await User.findOne({
        $or:[{email},{username}]
    })

    if(existedUser){
        throw new ApiError(400,"Email or username already exists")
    }

    const avatarlocalpath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path

    if (!avatarlocalpath){
        throw new ApiError(400,"Please upload avatar image")
    }

    const avatar=await uploadOnCloudinary(avatarlocalpath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);


    if(!avatar){
        throw new ApiError(500,"Failed to upload avatar image")
    }

    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    

    console.log("user is",user)
    console.log("file data",req.files )
    console.log("req body data" ,req.body)

    const createdUser = await User.findById(user._id).select("-password -refreshToken");


    if(!createdUser){
        throw new ApiError(500,"something went wrong while regestering user")
    }
    console.log("createdUser is",createdUser)

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
    res.status(200).json({
        message: "ok"
    });
});


const loginUser=asyncHandeler (async(req,res)=>{
    //re body se data lao
    //if username password email valid
    //check if username/email alreaddye exist
    //find the user and check password#
    //if password right give access and refresh token
    // send cookie and success response

    const{email,username,password}=req.body
    if (!email || !email){
        throw new ApiError(400,"username or password is required")
    }
   const user = await User.findOne({
        $or:[{email},{username}]
    })
    
    if(!user){
        throw new ApiError(404,"User doesnot exist")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials")
    }

    const {accessToken , refreshToken}=await generateAccessAndRefreshToken(user._id)

    const loggedInUser=User.findById(user._id).select("-password -refreshToken")

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



export { registerUser
    ,loginUser
    ,logoutUser
 };
