import mongoose from "mongoose";

const userVideoPhotoSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },media:[
    {
        url:{
        type:String,
        required:true
    },type:{
        type:String,
        enum:["video","photo"],
    },uploadedAt:{
        type:Date,
        default:Date.now
    }
    }
  ],timestamps:true
})

export const UserVideoPhoto = mongoose.model("UserVideoPhoto", userVideoPhotoSchema);