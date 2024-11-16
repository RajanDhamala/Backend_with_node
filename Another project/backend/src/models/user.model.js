import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true
    },email:{
        type:String,
        require:true,
        unique:true
    },password:{
        type:String,
        require:true
    },fullname:{
        type:String,
    },ProfilePicture:{
        type:String,
        require:false,
        default:""
    },RefreshToken:{
        type:String,
        require:false
    },isEmailVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

const User=mongoose.model("User",userSchema);

export default User;