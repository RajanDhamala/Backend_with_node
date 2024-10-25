import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js"
import bcrypt from "bcrypt";
import { uploadImage } from "../utils/cloudinary.js";
import fs from "fs"
import { generateJWT}  from "../utils/GenerateJWT.js";
import jwt from "jsonwebtoken";


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
        fullname,
    })

    await newUser.save();
    res.send(
        new ApiResponse(201, "Success", newUser)
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

    const isPasswordMatch =await bcrypt.compare(password, existingUser.password);

    if (!isPasswordMatch) {
        return res.send(new ApiResponse(400, "Invalid credentials"));
    }

    const genratedToken=generateAccessToken(existingUser);

    const { password: _, ...userData } = existingUser.toObject();
    res.cookie("token",genratedToken,{
        httpOnly:true,
        secure:true,
    })
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

const handelImg = asyncHandler(async (req, res) => {
    const { username } = req.body; 
    const profileImage = req.file;

    console.log(username, profileImage); 
  
    if (!profileImage || !username) {
        return res.status(400).json(new ApiResponse(400, "Please provide both username and image"));
    }
  
    try {
        const imageUrl = await uploadImage(profileImage.path, 'profile_images');
        console.log(imageUrl);
        fs.unlinkSync(profileImage.path);
        
  
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { ProfilePicture: imageUrl }, 
            { new: true } 
        );
  
        if (!updatedUser) {
            return res.status(404).json(new ApiResponse(404, "User not found"));
        }
  
        res.json(new ApiResponse(200, "Profile picture updated successfully", { username, ProfilePicture: imageUrl }));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, "Error uploading image"));
    }
});


const generateAccessToken = (user)=>{

    return jwt.sign({
        id:user._id,
        username:user.username,
    },process.env.ACCESS_TOKEN,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY});


}

const genrateRefreshToken=(user)=>{
return jwt.sign({
    id:user._id,
    username:user.username,
},process.env.REFRESH_TOKEN,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY});

}
  
 
export {
    registerUser,
    loginUser,
    changeUsername,
    handelImg
}