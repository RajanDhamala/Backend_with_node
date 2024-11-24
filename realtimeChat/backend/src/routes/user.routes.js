import express from 'express';
import {JwtAuthenticate} from '../middleware/JwtAuthencate.js';
import {registerUser,LoginUser,LogoutUser,UserProfile} from '../controller/ManageUsr.js';
const route=express.Router();

route.post("/register",registerUser);
route.post("/login",LoginUser);

route.get('/logout',LogoutUser)
route.get('/UserProfile',JwtAuthenticate,UserProfile)

export default route