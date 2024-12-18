import express from 'express';
import {JwtAuthenticate} from '../middleware/JwtAuthencate.js';
import {registerUser,LoginUser,LogoutUser,UserProfile,handleUpload,OtpHandeling,
OtpVerification,handelAi,handelAiImg,aiImgAnalysis,gptJsonResponse,getAllUsers,searchUser,uploadProfilePic, getUserProfile} from '../controller/ManageUsr.js';
import upload from '../middleware/MulterFileUpload.js';
import ImageAnalysis from '../middleware/MulterImgAnalysis.js'
import {SendMessageRequest,SeeFriendRequests,acceptRejectRequest,seeActiveUser,showFriendsList,handelChatInitiation,  createChatdtabase} from '../controller/ChatController.js'
import UploadPfp from '../middleware/MulterpfpUpload.js'

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

route.post('/aiImg',ImageAnalysis.single('imgToAnalysis'),aiImgAnalysis)
route.get('/json',gptJsonResponse)

route.post('/sendRequest',JwtAuthenticate,SendMessageRequest)

route.get('/getAllUsers',JwtAuthenticate,getAllUsers)
route.post('/searchUser',JwtAuthenticate,searchUser)

route.post('/setPfp',JwtAuthenticate,UploadPfp.single('ProfilePic'),uploadProfilePic)

route.get('/getProfile/:username',JwtAuthenticate, getUserProfile)

route.get('/requestList',JwtAuthenticate,SeeFriendRequests)

route.post('/friend-request/:action/:requestUser',JwtAuthenticate,acceptRejectRequest
)

route.get('/status/:username',JwtAuthenticate,seeActiveUser)

route.get('/friendsList/:username',JwtAuthenticate,showFriendsList)

route.get('/checkFriendship',JwtAuthenticate,handelChatInitiation)

route.get('/chat/:receiver/:message',JwtAuthenticate,  createChatdtabase)
  

export default route