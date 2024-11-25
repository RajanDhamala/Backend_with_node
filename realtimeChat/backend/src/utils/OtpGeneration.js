import speakeasy from 'speakeasy';
import dotenv from 'dotenv';

dotenv.config();

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
    VerifyOtp
}