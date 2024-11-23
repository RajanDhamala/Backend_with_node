import express from 'express';
import {JwtAuthenticate} from '../middleware/JwtAuthencate.js';
import {registerUser,LoginUser} from '../controller/ManageUsr.js';
const route=express.Router();

route.post("/register",registerUser);
route.post("/login",LoginUser);
route.get('/try',JwtAuthenticate,(req,res)=>{
    return res.send('hello user how are u')
})

export default route