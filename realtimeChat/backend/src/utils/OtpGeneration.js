import speakeasy from 'speakeasy';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const sendOtpEmail = async (recipientEmail, otp) => {
    const Transponder = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
    });
    try {
        await Transponder.sendMail({
            from: process.env.EMAIL,
            to: recipientEmail,
            subject: "OTP Verification",
            html: `
                <div style="font-size: 20px; font-family: Arial, sans-serif; color: #333;">
                    <p><strong>Your OTP is:</strong> <span style="color: blue;">${otp}</span></p>
                    <p>Please use this OTP to verify your email address.</p>
                </div>
            `
        });

        console.log("OTP sent successfully");

    } catch (error) {
        console.log("Error while sending email", error);
    }
}

function otpGeneration() {
    return speakeasy.totp({
        secret: process.env.OTP_SECRET,
        encoding: "base32",
        step: 300,
        digits: 6
    });
}

function VerifyOtp(userOtp){
    const isVerified= speakeasy.totp.verify({
        secret: process.env.OTP_SECRET,
        encoding: "base32",
        token: userOtp,
        step: 300, 
        digits: 6,
        window: 1, 
    });
    return isVerified
}

export {
    otpGeneration,
    VerifyOtp,
    sendOtpEmail
}