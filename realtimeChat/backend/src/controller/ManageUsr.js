import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.Model.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from 'bcrypt';
import { generateAccessToken,generateRefreshToken} from '../utils/JWTokenCreate.js'


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password,birthDate } = req.body;
    console.log(username, email, password,birthDate);

    if (!username || !email || !password ||!birthDate) {
        res.json(new ApiResponse(400, "Please provide all the fields", null));
        throw new Error("Please provide all the fields");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.json(new ApiResponse(400, "User already exists", null));
    }
    const hashedPassword= await bcrypt.hash(password,10);
    
    try {
        const newUser = new User({
            username,
            email,
            password:hashedPassword,
            birthDate
        });
        const savedUsr = await newUser.save();
        if (savedUsr) {
            return res.json(new ApiResponse(200, "User registered successfully", savedUsr));
        } else {
            return res.json(new ApiResponse(400, "Failed to register user", null));
        }
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json(new ApiResponse(500, "Server Error", null));
    }
});

const LoginUser=asyncHandler ( async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.json(new ApiResponse(400,"Please provide all the fields",null));
    }

    console.log(email,password);
    const existingUser=await User.findOne({email});

    if(!existingUser){
        return res.json(new ApiResponse(400,"User does not exist in database",null));
    }

    const isPasswordCorrect=await bcrypt.compare(password,existingUser.password);

    if(!isPasswordCorrect){
        return res.json(new ApiResponse(400,"Invalid credentials",null));
    }
    const accessToken=generateAccessToken(existingUser);
    const refreshToken=generateRefreshToken(existingUser);

    res.cookie(
        "refreshToken",refreshToken,
        {
            httpOnly:true,
            secure:true,
            maxAge: 10 * 60 * 1000,
        }
    )
    
    res.cookie(
        "accessToken",accessToken,{
            httpOnly:true,
            secure:true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }
    )

    return res.json(
        new ApiResponse(200,"User logged in successfully",{
            username:existingUser.username,
            email:existingUser.email,
            accessToken,
            refreshToken
        }
        )
    )
})

const LogoutUser = asyncHandler(async (req, res) => {
    console.log("Logging out user");
    
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
    });

  
    return res.json({
        status: 200,
        message: "User logged out successfully",
        data: null,
    });
});

const UserProfile=asyncHandler(async (req,res)=>{
    const userEmail=req.user.email;
    console.log("User email:",userEmail);
    const user=await User.findOne({email:userEmail});

    console.log("User:",user);

    if(!user){
        return res.json(new ApiResponse(400,"User not found",null));
    }
    const data={
        username:user.username,
        dob:user.dob,
        email:user.email,
        profilePic:user.profilePic,
        dob:user.birthDate
    }
    return res.json(new ApiResponse(200,"user found",data))
})

const uploadProfilePic=asyncHandler(async (req,res)=>{
    console.log("Uploading profile pic");

    if(!req.file){
        return res.json(new ApiResponse(400,"Please provide a file",null));
    }
    console.log("req.file:",req.file);

})

export {
    registerUser,
    LoginUser,
    LogoutUser,
    UserProfile,
    uploadProfilePic
};
