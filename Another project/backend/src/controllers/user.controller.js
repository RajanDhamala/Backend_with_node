import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const getJokes = asyncHandler(async (req, res) => {
    res.send(new ApiResponse(200, "Jokes retrieved successfully", [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "Why don't skeletons fight each other? They don't have the guts.",
        "What do you call fake spaghetti? An impasta!",
        "Why did the bicycle fall over? Because it was two-tired!",
        "What do you call cheese that isn't yours? Nacho cheese!",
        "Why did the math book look sad? Because it had too many problems.",
        "Why don't programmers like nature? It has too many bugs.",
        "Why do cows have hooves instead of feet? Because they lactose.",
        "What do you get when you cross a snowman and a vampire? Frostbite."
    ][Math.floor(Math.random() * 10)])); // Example response
});

const getUser = (req, res) => {
    // Function implementation here
};

const changeUsername = (req, res) => {
    // Function implementation here
};

const changePassword = (req, res) => {
    // Function implementation here
};

const deleteAccount = (req, res) => {
    // Function implementation here
};

export{
    getJokes,
    getUser,
    changeUsername,
    changePassword,
    deleteAccount
};