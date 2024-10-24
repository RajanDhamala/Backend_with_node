import express from "express";

import { getJokes, getUser, changeUsername,changePassword,
deleteAccount,registerUser } from "../controllers/user.controller.js";

const route=express.Router();

route.get("/",(req,res)=>{
    res.send("Hello World");
})


route.post("/register", registerUser);
route.get("/jokes", getJokes);
route.get("/user", getUser);
route.get("/changeUsername", changeUsername);
route.get("/changePassword", changePassword);
route.get("/deleteAccount", deleteAccount);

export default route;
