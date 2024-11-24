import User from '../models/User.Model.js';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import dotenv from 'dotenv';
import { ApiResponse } from '../utils/ApiResponse.js';

dotenv.config();

export const JwtAuthenticate = asyncHandler(async (req, res, next) => {
    const { refreshToken, accessToken } = req.cookies;

    if (!accessToken) {
        if (!refreshToken) {
            return res.status(401).json(new ApiResponse(401, "No tokens provided", null));
        }
        try {
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.Refresh_Secret);
            const user = await User.findOne({ email: decodedRefreshToken.email });

            if (!user || user.RefreshToken !== refreshToken) {
                return res.status(401).json(new ApiResponse(401, "Invalid refresh token", null));
            }

         
            const newAccessToken = jwt.sign(
                { userId: user._id, username: user.username, email: user.email },
                process.env.Access_Secret,
                { expiresIn: "15m" }
            );

            const newRefreshToken = jwt.sign(
                { email: user.email },
                process.env.Refresh_Secret,
                { expiresIn: "7d" }
            );

            user.RefreshToken = newRefreshToken;
            await user.save();

            res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true });
            res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true });

            req.user = { userId: user._id, username: user.username, email: user.email };
            return next();
        } catch (error) {
            return res.status(401).json(new ApiResponse(401, "Invalid or expired refresh token", null));
        }
    }

   
    try {
        const decodedAccessToken = jwt.verify(accessToken, process.env.Access_Secret);
        req.user = decodedAccessToken;
        return next();
    } catch (error) {
        return res.status(401).json(new ApiResponse(401, "Invalid or expired access token", null));
    }
});
