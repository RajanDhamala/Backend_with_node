import {asyncHandler} from '../utils/asyncHandler.js'
import User from '../models/User.Model.js'
import Chat from '../models/Group.Model.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

dotenv.config();



const AdminLogin=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({message:'email and password are required'})
    }

    console.log(email,password)
    if(password !==process.env.ADMIN_PASSWORD){
        return res.status(401).json({message:'Invalid credentials'})
    }
    const existingUser=await User.findOne({email})
    if(!existingUser){
        return res.status(401).json({message:'Invalid credentials'})
    }
    existingUser.role='admin'
    existingUser.save()
    
    const genrateAdminToken=(user)=>{
        const jwtpayload={
            id:existingUser._id,
            email:existingUser.email,
            username:existingUser.username
        }
      return jwt.sign(jwtpayload,process.env.ADMIN_Secret,{
        expiresIn:'1d'})
    }

    const token=genrateAdminToken(existingUser)

    res.cookie('adminToken',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        secure:true,
        maxAge: 24 * 60 * 60 * 1000,
    })
    res.send(new ApiResponse(200,'Admin logged in successfully',{token}))
})


const AdminLogout = asyncHandler(async (req, res) => {
    res.clearCookie('adminToken');

    console.log("Admin logged out successfully", req.user);
    res.status(200).json({
        success: true,
        message: 'Admin logged out successfully',
    });
});


const GetAllUsers=asyncHandler(async(req,res)=>{
    const admin=req.user.username;

    if(!admin){
        return res.send(new ApiResponse(400,'invalid user request',null))
    }
    const [getallUser, totalUsers] = await Promise.all([
        User.find({}).select('username isActive email -_id profilePic verifiedUser'),
        User.countDocuments({})
    ]);

    console.log(getallUser);
    return res.send(new ApiResponse(200, 'Fetched user details successfully', {
        users: getallUser,
        totalUsers: totalUsers,
    }));

})

const GetDbStats = asyncHandler(async (req, res) => {
    try {
        const stats = await mongoose.connection.db.command({ serverStatus: 1 });

        const metrics = {
            opcounters: stats.opcounters, // Counts of operations (insert, query, update, delete)
            connections: stats.connections, // Active and available connections
            memoryUsage: stats.mem, // Memory usage details
            network: stats.network, // Network stats (bytesIn, bytesOut)
        };

        return res.send({
            message: "Database metrics retrieved successfully",
            data: metrics,
        });
    } catch (err) {
        console.error('Error fetching database metrics:', err);
        return res.status(500).send({ message: "Failed to fetch database metrics" });
    }
});

const GetAllStats=asyncHandler(async(req,res)=>{
    const NoOfUsers=await User.countDocuments({})
    const NoOfChats=await Chat.countDocuments({})
    const NoOfActiveUsers=await User.countDocuments({isActive:true})

    console.log(NoOfUsers,NoOfChats,NoOfActiveUsers)
    return res.send(new ApiResponse(200,'Fetched all stats successfully',{
        NoOfUsers,NoOfChats,NoOfActiveUsers
    }))
})

const LatestLoginUser=asyncHandler(async (req,res)=>{
    const users=await User.find({}).sort({updatedAt:-1}).limit(1)
    console.log(users)
    return res.send(new ApiResponse(200,'Fetched latest login user successfully',{users}))
})

export {
    AdminLogin,
    AdminLogout,
    GetAllUsers,
    GetDbStats,
    GetAllStats
}