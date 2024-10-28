import {TwitterPost} from "../models/twitterPost.model.js"
import User from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs"
import  {imageORvideoUpload} from "../utils/CloudinaryVdPd.js"


const UserPostController = asyncHandler(async (req, res) => {
    const username = req.user.username;
    const { caption } = req.body;
    const content = req.file;

    if (!content) {
        return res.send(new ApiResponse(400, "Please provide a file"));
    }

    if (!caption) {
        return res.send(new ApiResponse(400, "Please provide a caption"));
    }

    try {
        const imageVideoUrl = await imageORvideoUpload(content.path, 'twitterPost', content.mimetype.split('/')[0]);
        
        // Remove the local file after upload
        fs.unlinkSync(content.path);

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.send(new ApiResponse(404, "User not found"));
        }

        const newTwitterPost = new TwitterPost({
            owner: existingUser._id,
            media: [{
                url: imageVideoUrl,
                type: content.mimetype.split('/')[0],
                uploadedAt: Date.now()
            }],
            caption: caption
        });

        await newTwitterPost.save();
        console.log("Post uploaded successfully");

        res.send(new ApiResponse(200, "Post uploaded successfully", {
            username,
            post: imageVideoUrl
        }));

    } catch (err) {
        console.log("Error uploading post", err);
        res.send(new ApiResponse(500, "Error uploading post", err.message)); // Include error message for debugging
    }
});



const sendTweetsToUser = asyncHandler(async (req, res) => {
    const username = req.user.username;

    if (!username) {
        return res.send(new ApiResponse(400, "Please provide username"));
    }

    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.send(new ApiResponse(404, "User not found"));
        }

        const tweets = await TwitterPost.find({ owner: existingUser._id }).populate('owner', 'username');

        if (tweets.length === 0) {
            return res.send(new ApiResponse(404, "No tweets found"));
        }

        const responseData = tweets.map(tweet => ({
            tweetId: tweet._id,
            owner: tweet.owner.username,
            media: Array.isArray(tweet.media) && tweet.media.length > 0 ? tweet.media[0].url : null, 
            caption: tweet.caption,
            likes: tweet.likes.length,
            isLiked: tweet.likes.includes(existingUser._id)
        }));

        res.json(new ApiResponse(200, "Success", responseData));

    } catch (err) {
        console.log("Error getting tweets", err);
        res.send(new ApiResponse(500, "Error getting tweets", err.message)); // Include error message for debugging
    }
});


const TweetLikeController = asyncHandler(async (req, res) => {
    const username = req.user.username;
    const { tweetId } = req.body;

    if (!tweetId || !username) {
        return res.send(new ApiResponse(400, "Please provide tweetId and username"));
    }

    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.send(new ApiResponse(404, "User not found"));
        }

        const tweet = await TwitterPost.findById(tweetId);
        if (!tweet) {
            return res.send(new ApiResponse(404, "Tweet not found"));
        }

        const isLiked = tweet.likes.includes(existingUser._id);

        // Update likes array based on whether the tweet is liked or unliked
        if (isLiked) {
            tweet.likes.pull(existingUser._id);  // Remove user from likes if they already liked
        } else {
            tweet.likes.push(existingUser._id);  // Add user to likes if they haven't liked
        }

        const updatedTweet = await tweet.save();  // Save changes
        const likeCount = updatedTweet.likes.length;  // Get the updated like count

        return res.send(new ApiResponse(200, `Tweet ${isLiked ? 'unliked' : 'liked'} successfully`, {
            likeCount,
            liked: !isLiked,
        }));
    } catch (error) {
        console.error("Error in liking/unliking tweet", error);
        return res.send(new ApiResponse(500, "Error in liking/unliking tweet"));
    }
});


export {
    UserPostController,
    sendTweetsToUser,
    TweetLikeController
}