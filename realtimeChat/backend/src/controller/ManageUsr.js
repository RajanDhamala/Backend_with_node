import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.Model.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from 'bcrypt';
import { generateAccessToken,generateRefreshToken} from '../utils/JWTokenCreate.js'
import { uploadFileToCloudinary } from '../utils/Cloudinary.js';
import {otpGeneration,VerifyOtp} from '../utils/OtpGeneration.js';
import { sendOtpEmail } from '../utils/OtpGeneration.js';
import  {handelText, handelImg,AiJsonResponse} from '../utils/handelGeminai.js';



const  registerUser= asyncHandler(async (req, res) => {
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
    const userRole = username === "rajandhamala" ? 'admin' : 'user';
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      birthDate,
      role: userRole, 
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
    console.log("Existing User:",existingUser);

    if(!existingUser){
        return res.json(new ApiResponse(400,"User does not exist in database",null));
    }

    const isPasswordCorrect=await bcrypt.compare(password,existingUser.password);

    if(!isPasswordCorrect){
        return res.json(new ApiResponse(400,"Invalid credentials",null));
    }
    const accessToken=generateAccessToken(existingUser);
    const refreshToken=generateRefreshToken(existingUser);
    const profilepic=existingUser.profilePic || 'no img in database';
    const username1=existingUser.username;

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
            httpOnly:false,
            secure:true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }
    )
    res.cookie("CurrentUser", JSON.stringify({ username1, profilepic }), {
      secure: true,
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
  });

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
    res.clearCookie("CurrentUser", {
      secure: true,
      httpOnly: true,
    });

    return res.json({
        status: 200,
        message: "User logged out successfully",
        data: null,
    });
});

const UserProfile=asyncHandler(async (req,res)=>{
    const userEmail=req.user.email;
    const user=await User.findOne({email:userEmail});

    if(!user){
        return res.json(new ApiResponse(400,"User not found",null));
    }
    const data={
        username:user.username,
        email:user.email,
        profilePic:user.profilePic,
        friends:user.friends.length,
        activeChats:user.activeChats.length,
        friendRequests:user.friendRequests.length
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

    if(existingUser.verifiedUser){
      return res.send(
        new ApiResponse
        (400,"User already verified",null)
      )
    }

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

    console.log("OTP:",otp);

    const existingUser=await User.findOne({email:req.user.email});

    if(!existingUser){
        return res.json(new ApiResponse(400,"User does not exist",null));
    }

    const isVerified=VerifyOtp(otp);
    const dbCheck=existingUser.UserOtp;


    console.log("isVerified:",isVerified);

    console.log("DBCheck:",dbCheck);


    if(!isVerified){
      console.log("Invalid OTP");
        return res.json(new ApiResponse(400,"Invalid OTP",{
          type:'error'
        }));
    }

    existingUser.verifiedUser=true;
    existingUser.UserOtp=null;
    await existingUser.save();
    console.log("User verified successfully");

    return res.json(new ApiResponse(200,"User verified successfully",{
    type:'success'}));

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

  const getAllUsers=asyncHandler (async (req,res)=>{
    const users = await User.find({}).select('username profilePic -_id');
    return res.json(new ApiResponse(200,"All Users",users));
  })

  const searchUser=asyncHandler(async (req,res)=>{
    console.log("Search User Request Body:",req.body);
    const {search}=req.body;
    const searchedBy=req.user.username
    const filter = search
    ? { username: { $regex: search, $options: "i" } } 
    : {};

  const users = await User.find(filter).select("username profilePic isActive");
  return res.json(new ApiResponse(200, "Filtered Users", users));
});

const uploadProfilePic = asyncHandler(async (req, res) => {
  if (!req.file) {
      console.log("Please provide an image");
      return res.json(new ApiResponse(400, "Please provide an image", null));
  }
  const img = req.file;
  const username = req.user.username;

  if (!img) {
      return res.json(new ApiResponse(400, "Please provide an image", null));
  }
  const existingUser = await User.findOne({ username });
  if (!existingUser) {
      return res.json(new ApiResponse(400, "User not found", null));
  }
  try {
      const fileUrl = await uploadFileToCloudinary(img.path, "Profile_pictures", username);
      existingUser.profilePic = fileUrl;
      await existingUser.save();
      res.cookie(
          "CurrentUser",
          JSON.stringify({ username, profilePic: fileUrl }),
          {
              secure: true, 
              httpOnly: false,
              maxAge: 7 * 24 * 60 * 60 * 1000,
          }
      );

      return res.json(new ApiResponse(200, "Profile picture uploaded successfully", fileUrl));
  } catch (err) {
      console.error("Error in uploading profile pic:", err);
      return res.json(new ApiResponse(500, "Server Error", null));
  }
});


const getUserProfile=asyncHandler (async (req,res)=>{
  const {username}=req.params;
  const searchedby=req.user.username;

  const user=await User.findOne({username}).select("username profilePic verifiedUser email birthDate activeChats friends -_id");

  if(searchedby===username){
    return res.send(new ApiResponse(201,"thats ur own profile",))
  }

  if(!user){
      return res.json(new ApiResponse(400,"User not found",null));
  }
  console.log("User found:",user);
  return res.json(new ApiResponse(200, "User found", {
    username: user.username,
    profilePic: user.profilePic,
    verifiedUser: user.verifiedUser,
    email: user.email ? user.email.substring(0, 3) + "****@" + user.email.split("@")[1] : null,
    birthDate: user.birthDate,
    activeChats: user.activeChats ? user.activeChats.length : 0,
    friends: user.friends ? user.friends.length : 0,
    active: user?.isActive
  }));  
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
    gptJsonResponse,
    getAllUsers,
    searchUser,
    uploadProfilePic,
    getUserProfile
};
