import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.Model.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from 'bcrypt';
import { generateAccessToken,generateRefreshToken} from '../utils/JWTokenCreate.js'
import { uploadFileToCloudinary } from '../utils/Cloudinary.js';
import {otpGeneration,VerifyOtp} from '../utils/OtpGeneration.js';
import { sendOtpEmail } from '../utils/OtpGeneration.js';
import  {handelText, handelImg,AiJsonResponse} from '../utils/handelGeminai.js';


const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, birthDate } = req.body;
  console.log("Request Body:", req.body);

  if (!username || !email || !password || !birthDate) {
      console.log("Missing fields");
      return res.json(new ApiResponse(400, "Please provide all the fields", null));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
      console.log("User already exists");
      return res.json(new ApiResponse(400, "User already exists", null));
  }

  let hashedPassword;
  try {
      hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
      console.error("Error hashing password:", error);
      return res.status(500).json(new ApiResponse(500, "Password hashing failed", null));
  }

  try {
      const newUser = new User({
          username,
          email,
          password: hashedPassword,
          birthDate,
      });
      const savedUsr = await newUser.save();
      console.log("Saved User:", savedUsr);

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
    existingUser.RefreshToken=refreshToken;
    existingUser.save();

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
  
   
  
      const existingUser = await User.findOne({ email: req.user.email });
  
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

    const existingUser=await User.findOne({email:req.user.email});

    const otp=otpGeneration();
    console.log(otp,"Generated OTP: for uer named",existingUser.username);
    try{
        const OtpUpdate=await existingUser.updateOne({UserOtp:otp});
        sendOtpEmail(existingUser.email,otp);
        return res.json(new ApiResponse(200,"OTP sent successfully"));

    }catch(error){
        return res.json(new ApiResponse(500,"Server Error"));
    }

  })

  const OtpVerification=asyncHandler(async (req,res)=>{
    const {otp}=req.body;

    const existingUser=await User.findOne({email:req.user.email});

    if(!existingUser){
        return res.json(new ApiResponse(400,"User does not exist",null));
    }

    const isVerified=VerifyOtp(otp);
    const dbCheck=existingUser.UserOtp;

    if(!isVerified && !dbCheck){
        return res.json(new ApiResponse(400,"Invalid OTP",null));
    }

    existingUser.verifiedUser=true;
    existingUser.UserOtp=null;
    await existingUser.save();

    return res.json(new ApiResponse(200,"User verified successfully",null));

  })

  const handelAi=asyncHandler(async (req,res)=>{
   const result=await handelText('im 1300 elo in chess.com').then((res)=>{
    console.log(res);
   });
    return res.send(new ApiResponse(200,"AI handeled successfully",result));
  })

  const handelAiImg = asyncHandler(async (req, res) => {
    try {
      const rawResult = await handelImg('return the response in json from my api endpoint analysize this image to fill form of ingo like name evloved form attacks type and edefense etcc', 'C:/Users/rajan/Desktop/Backend/Project/realtimeChat/backend/temp/uploads/ninja.png');
      const cleanedResult = rawResult.replace(/```json\n?|\n```/g, '').trim();
      let parsedResult;
      try {
        parsedResult = JSON.parse(cleanedResult);
      } catch (e) {
        parsedResult = cleanedResult; 
      }
  
      return res.send(new ApiResponse(200, "AI handled successfully", parsedResult));
    } catch (error) {
      console.error('Error handling AI image:', error);
      return res.status(500).send(new ApiResponse(500, "Failed to process image", error.message));
    }
  });

  const aiImgAnalysis = asyncHandler(async (req, res) => {
    const { prompt } = req.body;
    console.log("AI image analysis", req.file);
    try {
      const rawData = await handelImg(prompt, req.file.path);
      const cleanedData = rawData.replace(/```json\n?|\n```/g, '').trim();
      console.log(cleanedData.file);
      let parsedResult;
      try {
        parsedResult = JSON.parse(cleanedData);
        if (!Array.isArray(parsedResult)) {
          parsedResult = [{ key: 'response', description: cleanedData }];
        }
      } catch (e) {
        parsedResult = [{ key: 'response', description: cleanedData }];
      }
      return res.send(new ApiResponse(200, "AI image analysis completed", parsedResult));
    } catch (error) {
      console.error("Error in AI image analysis:", error);
      return res.status(500).json({ error: "AI image analysis failed." });
    }
  });

  const aifunctionCalling=asyncHandler ( async (req,res)=>{
    const {usrQuery,city}=req.body;

  })


  const gptJsonResponse=asyncHandler(async (req,res)=>{
    setTimeout(async() => {
      const result=await AiJsonResponse()
      return res.send(result)
    }, 2000);
  

  })
  
export {
    registerUser,
    LoginUser,
    LogoutUser,
    UserProfile,
    handleUpload,
    OtpHandeling,
    OtpVerification,
    handelAi,
    handelAiImg,
    aiImgAnalysis,
    aifunctionCalling,
    gptJsonResponse
};
