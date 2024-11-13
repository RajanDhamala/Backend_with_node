import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import User from "../models/user.model";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const Transponder=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    },
});

const sendOtpEmail=async(recipientEmail,otp)=>{
    try{

        await Transponder.sendMail({
            from:process.env.EMAIL,
            to:recipientEmail,
            subject:"OTP Verification",
            text:`Your OTP is ${otp}`
        })
        
        console.log("OTP sent successfully");

    }catch(error){
        console.log("Error while sending email",error);
    }
}

