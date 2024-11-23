import User from '../models/User.Model.js';
import jwt from 'jsonwebtoken';
import {asyncHandler} from '../utils/asyncHandler.js';
import dotenv from 'dotenv';
import { ApiResponse } from '../utils/ApiResponse.js';

dotenv.config();

export const JwtAuthenticate = asyncHandler(async (req, res, next) => {
    const { refreshToken, accessToken } = req.cookies;

    if (!accessToken) {
        return res.json(new ApiResponse(401, "Access token not found"));
    }

    try {
        const decodedAccessToken = jwt.verify(accessToken, process.env.Access_Secret);
        req.user = decodedAccessToken;
        return next();
    } catch (error) {
        if (!refreshToken) {
            return res.json(new ApiResponse(401, "Refresh token not found"));
        }

        try {
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.Refresh_Secret);
            const user = await User.findOne({ email: decodedRefreshToken.email });

            if (!user || user.RefreshToken !== refreshToken) {
                return res.json(new ApiResponse(401, "Invalid refresh token"));
            }

            const newAccessToken = jwt.sign(
                { userId: user._id, username: user.username },
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

            req.user = { userId: user._id, username: user.username };
            return next();
        } catch (refreshError) {
            return res.json(new ApiResponse(401, "Invalid or expired refresh token"));
        }
    }
});
