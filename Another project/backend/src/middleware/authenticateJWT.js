import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();


export const authenticateJWT = async (req, res, next) => {
const token=req.cookies.token;

if(!token){
    return res.json("Access token not found");
}

jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if(err){
        return res.json("Invalid acces token expired");
    }

    const existingUser=User.findOne({email:user.email});

    if (!existingUser) {
        return res.json("User not found");
    }
    req.user = user;
    next();

});





}