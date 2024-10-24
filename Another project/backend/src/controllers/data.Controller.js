import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js"
import bcrypt from "bcrypt";
import express from "express";

const registerUser=asyncHandler(async(req,res)=>{
    const {username,email,password,fullname}=req.body;
    console.log(username,email,password,fullname)

    if (!username || !email || !password) {
        return res.send(
            new ApiResponse(400, "Please provide username, email and password")
        )
    }

    const existingEmail=await User.findOne({email});

    if(existingEmail){
        return res.send(
            new ApiResponse(400, "Email already exists")
        )
    }

    const hashedPassword= await bcrypt.hash(password,10);

    const newUser=new User({
        username,
        email,
        password:hashedPassword,
        fullname
    })

    await newUser.save();
    res.send(
        new ApiResponse(201, "User created successfully", newUser)
    )
   
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log(email, password);
    
    if (!email || !password) {
        return res.send(new ApiResponse(400, "Email and password are required"));
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        return res.send(new ApiResponse(404, "User not found"));
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordMatch) {
        return res.send(new ApiResponse(400, "Invalid credentials"));
    }


    const { password: _, ...userData } = existingUser.toObject();

    res.send(new ApiResponse(200, "Login successful", userData));
});

const changeUsername=asyncHandler(async(req,res)=>{
    const {username,newUsername}=req.body;

    console.log(username,newUsername);

    if(!username || !newUsername){
        return res.json(
        new ApiResponse(400, "Please provide a username")
        )
    }

    const currentUser=await User.findOne({username});

    if(!currentUser){
        return res.json(
            new ApiResponse(404, "User not found")
        )
    }

    currentUser.username=newUsername;
    await currentUser.save();

    return res.status(200).json(
        new ApiResponse(200, "Username updated successfully", { newUsername })
    );
})

 

export {
    registerUser,
    loginUser,
    changeUsername
}