const asyncHandeler =(fn)=>async(req,res,next)=>{

    try {
        
    } catch (error) {
        res.status(Err.code || 500).json({
            success:false,
            message:Err.message
        })
    }

}
export {asyncHandeler};