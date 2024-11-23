import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

const connectDb=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_URI}/${"ChatApp"}`);
        console.log("Connected with ....",connectionInstance.connection.host)

    }catch(error){
        console.log("error which connecting to databse",error);
        process.exit(1);
    }
}

export default connectDb;