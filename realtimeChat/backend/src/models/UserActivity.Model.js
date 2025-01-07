import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserActivitySchema =new Schema({
    User:{
        type:Schema.Types.ObjectId,
        ref:'Users'
    },
},{timestamps:true})

export default mongoose.model('UserActivity',UserActivitySchema)