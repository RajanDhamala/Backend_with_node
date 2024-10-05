import {asyncHandeler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

    const createdUser = await User.findById(createdUser._id).select("-password -refreshToken");

   

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



export { registerUser };
