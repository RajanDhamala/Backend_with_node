import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import route from "./src/routes/user.routes.js"

dotenv.config()

const app=express()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: [
      'http://localhost:5173',
      'http://192.168.56.1:5173',
      'http://192.168.100.201:5173',
      'http://172.19.240.1:5173'
    ],
    credentials: true,
  }));
  

app.use("/api",route)


export default app