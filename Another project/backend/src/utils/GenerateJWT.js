import jwt from 'jsonwebtoken';
import dotemv from 'dotenv';

dotemv.config();

const secretKey = process.env.JWT_SECRET;

const generateJWT = (user)=>{
    const token=jwt.sign(
        {
            id:user._id,
            username:user.username,
        },secretKey,{expiresIn:"64h"}
    )
    return token;
}



export {generateJWT}
