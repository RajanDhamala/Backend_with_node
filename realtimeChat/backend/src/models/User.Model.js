import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxlength: 15
    },
    email: {
        type: String,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    verifiedUser: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    profilepic: {
        type: String,
        default: ""
    },
    RefreshToken: {
        type: String,
        default: ""
    },
    OTPverify: {
        type: String,
        maxlength: 6,
        required: false
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
