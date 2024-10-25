import express from "express";
import { getJokes}  from "../controllers/user.controller.js";
import {loginUser,changeUsername,uploadImg,
registerUser } from "../controllers/data.Controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const route=express.Router();

route.get("/",(req,res)=>{
    res.send("Hello World");
})

route.post("/register", registerUser);
route.post("/login", loginUser);
route.post("/uploadImg", uploadImg);
route.post("/changeUsername", changeUsername);

route.get("/jokes", getJokes);




export default route;
