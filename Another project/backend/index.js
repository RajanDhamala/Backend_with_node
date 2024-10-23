import express from "express"
import dotenv from "dotenv"

dotenv.config();
const app=express();
const PORT=process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.get("/url",(req,res)=>{
    res.send("About Us");
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})