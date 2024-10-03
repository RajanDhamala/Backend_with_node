;(async ()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`,)
//         application.on("error" , (error)=>{
//             console.error("Error: ", error)
//             throw new Error("Error connecting to the database")
//         })
//     }catch(error){
//         console.error("Error: ", error)
//     }
// } )()