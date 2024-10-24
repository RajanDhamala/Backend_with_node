import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./src/routes/user.routes.js"; // Ensure this path is correct

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json()); // Important for handling POST requests
app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello World");
});

// Mount the user router with the prefix "/users"
app.use("/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
