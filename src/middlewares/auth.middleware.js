import {asyncHandeler} from '../utils/asyncHandeler.js'
import {ApiError} from '../utils/ApiError.js'
import jwwt from 'jsonwebtoken'
import {User} from '../models/user.model.js'
export const verifyJWt=asyncHandeler(async(req,res,next)=>{
   try {
     const token=req.cookkies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
     if (!token) {
         throw new ApiError(401, "Unouthorized request")
     }
 
     const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const user=await User.findById(decodedToken?.id).select("-password  -refreshToken")
 
     if(!user){
         throw new ApiError(401, "Invalid access token")
     }
     req.user=UserActivation;
     next();
   } catch (error) {
    throw new ApiError(401, error?.message,"invalid access token")
   }
})