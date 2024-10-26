import express from "express";
import { getJokes}  from "../controllers/user.controller.js";
import {loginUser,changeUsername,handelImg,
registerUser } from "../controllers/data.Controller.js";
import upload from "../middleware/multerMiddle.js";

import { authenticateJWT } from "../middleware/authenticateJWT.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const route=express.Router();

route.get("/",(req,res)=>{
    res.send("Hello World");
})

route.post("/register", registerUser);
route.post("/login", loginUser);
route.post('/uploadImg', upload.single('profileImage'), handelImg);

route.get("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.send("Logged out");
});

route.get("/profile",authenticateJWT, async(req, res) => {

    try{
        const usrdetail=await User.findById(req.user.id);

        if(!usrdetail){
            return res.send(
                new ApiResponse(404, "User not found")
            )
        }

        const { password, ...userData } = usrdetail.toObject();
        res.send(new ApiResponse(200, "Success", userData));

        


    }catch(err){
        res.status(500).send(new ApiResponse(500, "Error retrieving user details"));
        
    }
    
});

route.post("/changeUsername", changeUsername);

route.get("/jokes", getJokes);

export default route;
