import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import route from "./src/routes/user.routes.js"
import statusMonitor from "express-status-monitor"

dotenv.config()

const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(statusMonitor())
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials:true
    }
))

app.use("/api",route)

app.get('/status',(req,res)=>{
    res.sendStatus(200)
})

export default app