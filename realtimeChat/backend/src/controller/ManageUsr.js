import {asyncHandler} from '../utils/asyncHandler.js';
import User from '../models/User.Model.js'
import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser= asyncHandler(async (req,res)=>{
    const {username,email,password}=req.body;

    if(!username || !email || !password){
        res.status(400);
        throw new Error("Please provide all the fields");
    }

    const existingUser= await User.findOne({email});

    if(existingUser){
        res.status(400);
        return new ApiResponse(200,"User already exists");
    }

    try{
        const newUser=new User({
            username,
            email,
            password
        });

        const savedUsr=await newUser.save();
        if(savedUsr){
            return new ApiResponse(200,"User registered successfully",savedUsr);
        }else{
            return new ApiResponse(400,"Failed to register user");
        }

    }catch(Error){
        return new ApiResponse(500,"Server Error",failed);
    }
  


})

export{
    registerUser
}