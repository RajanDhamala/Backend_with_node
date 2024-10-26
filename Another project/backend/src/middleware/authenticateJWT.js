import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import { generateAccessToken } from "../controllers/data.Controller.js";

dotenv.config();

export const authenticateJWT = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    jwt.verify(accessToken, process.env.ACCESS_TOKEN, async (err, decodedToken) => {
        if (!err) {
            req.user = decodedToken;
            console.log(decodedToken)
            return next();
        }
 
        if (!refreshToken) {
            return res.status(401).json({ error: "Refresh token not found" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (refreshErr, refreshDecoded) => {
            if (refreshErr) {
                return res.status(403).json({ error: "Invalid or expired refresh token" });
            }

        
            const existingUser = await User.findOne({ email: refreshDecoded.email });
            if (!existingUser || existingUser.RefreshToken !== refreshToken) {
                res.clearCookie("accessToken");
                return res.status(403).json({ error: "Invalid refresh token" });
                
            }

            const newAccessToken = generateAccessToken(existingUser);

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
            });

            req.user = refreshDecoded;
            next();
        });
    });
};