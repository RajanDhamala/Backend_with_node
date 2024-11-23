import express from 'express';
import {registerUser,LoginUser} from '../controller/ManageUsr.js';
const route=express.Router();

route.post("/register",registerUser);
route.post("/login",LoginUser);

export default route