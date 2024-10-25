import connectDb from "./src/database/index.js";
import dotenv from "dotenv";
import app from "./app.js";


dotenv.config();


connectDb()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}).catch((error)=>{
    console.log("Error while connecting to database",error);
    process.exit(1);
})

app.get("/",(req,res)=>{    
    res.send("Hello World");});

;