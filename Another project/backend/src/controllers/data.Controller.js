import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js"
import bcrypt from "bcrypt";
import { uploadImage } from "../utils/cloudinary.js";
import fs from "fs"
import jwt from "jsonwebtoken";
import UserVideoPhoto from "../models/userVideoPhoto.model.js";


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

    const genratedAccessToken=generateAccessToken(existingUser);
    const generatedRefreshToken=genrateRefreshToken(existingUser);
    try {
        await User.findOneAndUpdate(
            { email: existingUser.email },
            {RefreshToken: generatedRefreshToken },
            { new: true }
        );
    } catch (error) {
        return res.status(500).send(new ApiResponse(500, "Error updating tokens in the database"));
    }

    const { password: _, ...userData } = existingUser.toObject();

    res.cookie("accessToken", genratedAccessToken, {
        httpOnly: true,
        secure: false, 
    });

    res.cookie("refreshToken", generatedRefreshToken, {
        httpOnly: true,
        secure: false, 
        maxAge: 15 * 24 * 60 * 60 * 1000 
    });
    
    
    res.status(200).send(new ApiResponse(200, "Login successful", userData,));
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

const uploadVideoPhoto = asyncHandler(async (req, res) => {
    const username = req.user.username;  
    const videoPhoto = req.file;

    console.log(req.cookies);
    console.log(username, videoPhoto);

    if (!videoPhoto || !username) {
        return res.status(400).json(new ApiResponse(400, "Please provide both username and video/photo"));
    }

    try {
        const imageVideoUrl = await uploadImage(videoPhoto.path, 'video_photos', true);

        fs.unlinkSync(videoPhoto.path);

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(404).json(new ApiResponse(404, "User not found"));
        }

        const userVideoPhoto = new UserVideoPhoto({
            user: existingUser._id,
            media: [{
                url: imageVideoUrl, 
                type: videoPhoto.mimetype.split("/")[0],  
                uploadedAt: Date.now()
            }]
        });

        const update = await userVideoPhoto.save();

        res.status(200).json(new ApiResponse(200, "Video/photo uploaded successfully", {
            username,
            videoPhoto: imageVideoUrl
        }));
    } catch (error) {
        console.error('Error uploading video/photo:', error);
        res.status(500).json(new ApiResponse(500, "Error uploading video/photo"));
    }
});

const handelVideopost = asyncHandler(async (req, res) => {
    const username = req.user.username;
  
    if (!username) {
      console.log("Please provide a username");
      return res.status(400).json(
        new ApiResponse(400, "Please provide a username")
      );
    }
  
    try {
      const currentUser = await User.findOne({ username }).select('username');
  
      if (!currentUser) {
        console.log("User not found");
        return res.status(404).json(
          new ApiResponse(404, "User not found")
        );
      }
     
      const userVideoPhotos = await UserVideoPhoto.find({ user: currentUser._id }).select('-createdAt -updatedAt');
  
      if (!userVideoPhotos || userVideoPhotos.length === 0) {
        console.log("No videos or photos found for this user");
        return res.status(404).json(
          new ApiResponse(404, "No videos or photos found for this user")
        );
      }
  
     
      const allMedia = userVideoPhotos.flatMap(videoPhoto => videoPhoto.media);
  
      return res.status(200).json(
        new ApiResponse(200, "User video/photo data retrieved successfully", {
          username: currentUser.username,
          media: allMedia
        })
      );
    } catch (error) {
      console.error("Error retrieving user details:", error);
      return res.status(500).json(
        new ApiResponse(500, "Error retrieving user details")
      );
    }
  });

  const sendprofile=asyncHandler(async(req,res)=>{
    try {
        const userDetail = await User.findById(req.user.id); 

        if (!userDetail) {
            return res.send(new ApiResponse(404, "User not found"));
        }

        const { password, ...userData } = userDetail.toObject(); 
        res.send(new ApiResponse(200, "Success", userData)); 

    } catch (err) {
        console.error("Error retrieving user details:", err); 
        res.status(500).send(new ApiResponse(500, "Error retrieving user details")); 
    }   
})
  
export {
    registerUser,
    loginUser,
    changeUsername,
    handelImg,
    generateAccessToken,
    genrateRefreshToken,
    uploadVideoPhoto,
    handelVideopost,
    sendprofile
}