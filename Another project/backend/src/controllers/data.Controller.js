import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js"
import bcrypt from "bcrypt";

const registerUser=asyncHandler(async(req,res)=>{
    const {username,email,password,fullname}=req.body;

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
    const {email,password}=req.body;
    
     if (!email || !password) {
         return res.send(new ApiResponse(400, "Email and password are required"));
     }
 
     const existingUser=User.findOne({email})
     if(!existingUser){
         return res.send(new ApiResponse(404, "User not found"));
     }
 
     const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
 
     if (!isPasswordMatch) {
         return res.send(new ApiResponse(400, "Invalid credentials"));
     }
     const { password: _, ...userData } = user.toObject(); // Exclude password from the response
 
     res.send(new ApiResponse(200, "Login successful", userData));
 });
 

export {
    registerUser,
    loginUser
}