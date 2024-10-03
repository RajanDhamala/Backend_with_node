import connectDB from "./db/index.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path: "./env"
});
connectDB();























// import mongoose from "mongoose"
// import { DB_NAME } from "./constants";

// console.log("DB_NAME: ", DB_NAME)
// ;(async ()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`,)
//         application.on("error" , (error)=>{
//             console.error("Error: ", error)
//             throw error  
//         })
//         app.listen(process.env.PORT, ()=>{
//             console.log("Server is running on port 3000",process.env.PORT)
//         })
//     }catch(error){
//         console.error("Error: ", error)
//     }
// } )()