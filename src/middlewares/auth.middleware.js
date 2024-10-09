import {asyncHandeler} from '../utils/asyncHandeler.js'

export const verifyJWt=asyncHandeler(async(req,res,next)=>{
    req.cookkies?.accessToken || req.header("Authorization")?
})