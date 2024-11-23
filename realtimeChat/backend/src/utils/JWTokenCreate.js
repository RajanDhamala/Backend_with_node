import jwt from 'jsonwebtoken';

const generateAccessToken=(user)=>{
    const userPayload={
        id:user.id,
        email:user.email,
        username:user.username
    }
    return jwt.sign(userPayload,process.env.Access_Secret,
        { expiresIn:process.env.Access_LifeSpan})
}

const generateRefreshToken=(user)=>{
    const userPayload={
        id:user.id,
        email:user.email,
        username:user.username
    }
    return jwt.sign(userPayload,process.env.Refresh_Secret,
        {expiresIn:process.env.Refresh_LifeSpan})
}

export {
    generateAccessToken,
    generateRefreshToken
}