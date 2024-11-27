import express from 'express';
import {JwtAuthenticate} from '../middleware/JwtAuthencate.js';
import {registerUser,LoginUser,LogoutUser,UserProfile,handleUpload,OtpHandeling,
OtpVerification,handelAi,handelAiImg} from '../controller/ManageUsr.js';
import upload from '../middleware/MulterFileUpload.js';


const route=express.Router();

route.post("/register",registerUser);
route.post("/login",LoginUser);

route.get('/logout',LogoutUser)
route.get('/UserProfile',JwtAuthenticate,UserProfile)
route.post('/UploadProfilePic',JwtAuthenticate,upload.single('ProfilePic'),handleUpload)

route.get('/OtpRequest',JwtAuthenticate,OtpHandeling);
route.post('/OtpVerification',JwtAuthenticate,OtpVerification);

route.get("/ai",handelAi)
route.get('/aiImg',handelAiImg)


export default route