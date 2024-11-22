import express from 'express';

const route=express.Router();

route.get("/user",(req,res)=>{
    res.send("Hello User")
})

export default route