import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";  // Make sure to import `app` from `app.js`

dotenv.config({
    path: "./.env"
});

// Connect to MongoDB and start the server
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server is running on port", process.env.PORT || 8000);
    });
})
.catch((error) => {
    console.log("MongoDB connection failed", error);
    process.exit(1);
});
