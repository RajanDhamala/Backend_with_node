import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./src/routes/user.routes.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cors())

app.use("/users", userRouter);


export default app