import mongoose from "mongoose";
import { Schema } from "mongoose";
import { time } from "speakeasy";

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
    profilePic: {
        type: String,
        default: ""
    },
    isActive:{
        type:Boolean,
        default:false
    },
    RefreshToken: {
        type: String,
        default: ""
    },
    UserOtp: {
        type: String,
        maxlength: 6,
        required: false
    },birthDate:{
        type:Date,
        required:false
    },activeChats: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ],friends:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            username: { type: String, required: true }
        }
    ],friendRequests:[
        {
            from: { type: Schema.Types.ObjectId, ref: 'Users' },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const User = mongoose.model('Users', userSchema);

export default User;
