import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./src/routes/user.routes.js"; 
import cookieParser from "cookie-parser";


dotenv.config();


const app = express();
app.use(cookieParser())

app.use(express.json()); 
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials:true
    }
))

app.use("/users", userRouter);


app.get("/set-cookie",(req,res)=>{
    res.cookie("mycookies","cookiesVlaue"
         ,{
            secure:true,
            httpOnly:true
        })
    res.send("cookie has been set")
})

app.get("/get-cookie",(req,res)=>{
    const cookie = req.cookies.mycookies
    res.send(cookie)
})


export default app