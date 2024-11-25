import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.Model.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from 'bcrypt';
import { generateAccessToken,generateRefreshToken} from '../utils/JWTokenCreate.js'
import { uploadFileToCloudinary } from '../utils/Cloudinary.js';
import fs from 'fs/promises';
import {otpGeneration,VerifyOtp} from '../utils/OtpGeneration.js';
import nodemailer from 'nodemailer';


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

const handleUpload = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const isProfilePicture = req.body.isProfilePicture;
    let folderName;
    const fileName = req.file.filename; 
  
    if (isProfilePicture === 'true') {
      folderName = 'Profile_pictures';
    } else if (req.file.mimetype.startsWith('image/')) {
      folderName = 'images';
    } else if (req.file.mimetype.startsWith('video/')) {
      folderName = 'videos';
    } else if (req.file.mimetype === 'application/pdf') {
      folderName = 'pdfs';
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }
  
    try {
      const fileUrl = await uploadFileToCloudinary(req.file.path, folderName, fileName);  
  
   
  
      const existingUser = await User.findOne({ email: 'rajandhamala0123@gmail.com' });
  
      if (isProfilePicture === 'true') {
        existingUser.profilePic = fileUrl; 
        await existingUser.save();
      }
  
      res.status(200).json({ message: 'File uploaded successfully', url: fileUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'File upload failed' });
    }
  });


  const OtpHandeling=asyncHandler(async (req,res)=>{

    const existingUser=await User.findOne({email:'rajandhamala0123@gmail.com'});

    const otp=otpGeneration();
    console.log(otp,"Generated OTP: for uer named",existingUser.username);
    try{
        const OtpUpdate=await existingUser.updateOne({UserOtp:otp});
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: "maddison53@ethereal.email",
              pass: "jn7jnAPss4f63QBp6D",
            },
          });

    }catch(error){
        return res.json(new ApiResponse(500,"Server Error"));
    }

  })


  const OtpVerification=asyncHandler(async (req,res)=>{
    const {email,otp}=req.body;

    const existingUser=await User.findOne({email});

    if(!existingUser){
        return res.json(new ApiResponse(400,"User does not exist",null));
    }

    const isVerified=VerifyOtp(otp);

    if(!isVerified){
        return res.json(new ApiResponse(400,"Invalid OTP",null));
    }

    existingUser.verifiedUser=true;
    await existingUser.save();

    return res.json(new ApiResponse(200,"User verified successfully",null));

  })

export {
    registerUser,
    LoginUser,
    LogoutUser,
    UserProfile,
    handleUpload,
    OtpHandeling,
    OtpVerification
};
