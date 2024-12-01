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
    profilePic: {
        type: String,
        default: ""
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
            ref: 'User'
        }
    ], friendRequests:[
        {
            from: { type: Schema.Types.ObjectId, ref: 'User' },
            status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
        }
    ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
