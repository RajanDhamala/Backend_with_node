import mongoose from "mongoose";

const twitterPostSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    },
    caption:{
        type:String,
        default:""
    },likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:[]
        }
    ],url:{
        type:String,
        required:false
       }
        
    ,comments:[
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
            default:Date.now
            }
        }
    ]
},{
    timestamps:true
})

export const TwitterPost=mongoose.model('TwitterPost',twitterPostSchema);

