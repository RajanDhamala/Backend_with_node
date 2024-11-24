import express from 'express';
import {JwtAuthenticate} from '../middleware/JwtAuthencate.js';
import {registerUser,LoginUser,LogoutUser,UserProfile,uploadProfilePic} from '../controller/ManageUsr.js';
import upload from '../middleware/MulterFileUpload.js';


const route=express.Router();

route.post("/register",registerUser);
route.post("/login",LoginUser);

route.get('/logout',LogoutUser)
route.get('/UserProfile',JwtAuthenticate,UserProfile)
route.post('/UploadProfilePic',upload.single('ProfilePic'),(req,res)=>{
    console.log("Uploading profile pic");
    return res.send("Profile pic uploaded")
})

export default route