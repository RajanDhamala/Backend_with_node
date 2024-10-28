import express from "express";
import { getJokes}  from "../controllers/user.controller.js";
import {loginUser,changeUsername,handelImg,
registerUser, uploadVideoPhoto, handelVideopost } from "../controllers/data.Controller.js";
import upload from "../middleware/multerMiddle.js";

import { authenticateJWT } from "../middleware/authenticateJWT.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {UserPostController,sendTweetsToUser,TweetLikeController} from "../controllers/UserPost.controller.js";


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

route.get("/profile", authenticateJWT, async (req, res) => {
    try {
        const userDetail = await User.findById(req.user.id); 

        if (!userDetail) {
            return res.send(new ApiResponse(404, "User not found"));
        }

        const { password, ...userData } = userDetail.toObject(); 
        res.send(new ApiResponse(200, "Success", userData)); 

    } catch (err) {
        console.error("Error retrieving user details:", err); 
        res.status(500).send(new ApiResponse(500, "Error retrieving user details")); 
    }
});


route.post("/changeUsername", changeUsername);

route.get("/jokes", getJokes);

route.post("/uploadVideoPhoto", upload.single("videoPhoto"), authenticateJWT, uploadVideoPhoto);

route.get("/videoPost",authenticateJWT, handelVideopost);

route.post("/postTweets", upload.single("content"), authenticateJWT, UserPostController);

route.get("/Gettweets", authenticateJWT, sendTweetsToUser);

route.post("/likeTweets", authenticateJWT, TweetLikeController);



export default route;
