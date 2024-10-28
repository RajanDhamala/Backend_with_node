import mongoose from "mongoose";

const twitterPostSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    caption:{
        type:String,
        default:""
    },likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        }
    ]
    ,dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
          }
    ]
    ,content:{
        type:String,
        required:false
    },comments:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },comment:{
                type:String,
                required:true
            },commentedAt:{
            type:Date,
            required:true,
            }
        }
    ]
},{
    timestamps:true
})

const TwitterPost=mongoose.model('TwitterPost',twitterPostSchema);

export default TwitterPost