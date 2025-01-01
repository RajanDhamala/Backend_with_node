import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

dotenv.config();

const socketJwtMiddleware = async (socket, next) => {
    try {
        const rawCookies = socket.handshake.headers.cookie;
        if (!rawCookies) {
            return next(new Error('Authentication error: No cookies provided'));
        }

        const cookies = cookie.parse(rawCookies);
        const accessToken = cookies.accessToken;

        if (!accessToken) {
            return next(new Error('Authentication error: No accessToken provided'));
        }

        const decoded = jwt.verify(accessToken, process.env.Access_Secret);
        socket.user = decoded; 
        return next(); 
    } catch (err) {
        return next(new Error('Authentication error: Invalid or expired token'));
    }
};

export default socketJwtMiddleware;
