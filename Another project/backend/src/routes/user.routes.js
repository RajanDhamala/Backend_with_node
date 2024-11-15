import express from "express";
import { getJokes}  from "../controllers/user.controller.js";
import {loginUser,changeUsername,handelImg,
registerUser, uploadVideoPhoto, handelVideopost,sendprofile } from "../controllers/data.Controller.js";
import upload from "../middleware/multerMiddle.js";

import { authenticateJWT } from "../middleware/authenticateJWT.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {UserPostController,sendTweetsToUser,TweetLikeController,TweetCommentSender,TweetCommentController} from "../controllers/UserPost.controller.js";
import {otpgeneration,sendOtpEmail, VerifyOtp} from "../controllers/otpVerification.js"


const route=express.Router();

route.get("/",(req,res)=>{
    res.send("Hello World");
})

route.post("/register", registerUser);
route.post("/login", loginUser);
route.post('/uploadImg', upload.single('profileImage'),authenticateJWT, handelImg);

route.get("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.send("Logged out");
});

route.get("/profile", authenticateJWT, sendprofile)
 

route.post("/changeUsername", changeUsername);

route.get("/jokes", getJokes);

route.post("/uploadVideoPhoto", upload.single("videoPhoto"), authenticateJWT, uploadVideoPhoto);

route.get("/videoPost",authenticateJWT, handelVideopost);

route.post("/postTweets", upload.single("content"), authenticateJWT, UserPostController);

route.get("/Gettweets", authenticateJWT, sendTweetsToUser);

route.post("/likeTweets", authenticateJWT, TweetLikeController);

route.post("/commentTweets", authenticateJWT, TweetCommentSender);

route.post("/comment", authenticateJWT, TweetCommentController);

route.post("/getOtp",async (req,res)=>{
    
    const {email}=req.body;
    console.log(process.env.EMAIL ,process.env.PASSWORD);
    const otp=otpgeneration();
    const emailsent=await sendOtpEmail(email,otp);
    console.log(emailsent , otp);

    
})

route.post("/verifyOtp",async (req,res)=>{
    const {email,otp}=req.body;
    const isVerified=VerifyOtp(otp);

    if(isVerified){
        return res.send(new ApiResponse(200,"OTP verified successfully"));
    }else{
        return res.send(new ApiResponse(400,"OTP verification failed"));
    }

})





export default route;
