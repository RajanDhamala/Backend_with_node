import { DB_NAME } from "../../const.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("Connected with ....",connectionInstance.connection.host)

    }catch(error){
        console.log("error which connecting to databse",error);
        process.exit(1);
    }
}

export default connectDb;