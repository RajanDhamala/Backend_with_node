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
        
        fs.unlinkSync(content.path);

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.send(new ApiResponse(404, "User not found"));
        }

        const newTwitterPost=new TwitterPost({
            owner:existingUser._id,
            caption:caption,
            url:imageVideoUrl,
            comments: [],
        })

        await newTwitterPost.save();
        console.log("Post uploaded successfully");

        res.send(new ApiResponse(200, "Post uploaded successfully", {
            username,
            postedConentUrl: imageVideoUrl
        }));

    } catch (err) {
        console.log("Error uploading post", err);
        res.send(new ApiResponse(500, "Error uploading post", err.message)); 
    }
});


const sendTweetsToUser = asyncHandler(async (req, res) => {
    const username = req.user.username;

    if (!username) {
        return res.status(400).send(new ApiResponse(400, "Please provide username"));
    }

    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(404).send(new ApiResponse(404, "User not found"));
        }

        const tweets = await TwitterPost.find({ owner: existingUser._id }).populate('owner', 'username');

        if (tweets.length === 0) {
            return res.status(404).send(new ApiResponse(404, "No tweets found"));
        }

     
        const responseData = tweets.map(tweet => ({
            tweetId: tweet._id,
            owner: tweet.owner.username,
            contentURL: tweet.url,
            caption: tweet.caption,
            likes: tweet.likes.length,
            isLiked: tweet.likes.includes(existingUser._id),
            uploadedAt: tweet.createdAt, 
            commentCount: tweet.comments.length 
        }));

      
        return res.status(200).json(new ApiResponse(200, "Success", responseData));

    } catch (err) {
        console.log("Error getting tweets", err);
        return res.status(500).send(new ApiResponse(500, "Error getting tweets", err.message));
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

     
        if (isLiked) {
            tweet.likes.pull(existingUser._id);  
        } else {
            tweet.likes.push(existingUser._id); 
        }

        const updatedTweet = await tweet.save();  
        const likeCount = updatedTweet.likes.length;  

        return res.send(new ApiResponse(200, `Tweet ${isLiked ? 'unliked' : 'liked'} successfully`, {
            likeCount,
            liked: !isLiked,
        }));
    } catch (error) {
        console.error("Error in liking/unliking tweet", error);
        return res.send(new ApiResponse(500, "Error in liking/unliking tweet"));
    }
});

const TweetCommentController = asyncHandler(async (req, res) => {
    const username = req.user.username;
    const { tweetId, comment } = req.body; 
    console.log("TweetId:", tweetId,username,comment); 

    if(!comment){
        return res.send(new ApiResponse(400,"Please provide a comment"));
    }
  
    if (!username) {
        return res.status(400).send(new ApiResponse(400, "Please provide username"));
    }

    if (!tweetId || !comment || comment.trim().length === 0) { 
        return res.status(400).send(new ApiResponse(400, "Please provide tweetId and a valid comment"));
    }

    try {
       
        const existingUser = await User.findOne({ username });
        const tweet = await TwitterPost.findById(tweetId); 

    
        if (!existingUser) {
            return res.status(404).send(new ApiResponse(404, "User not found in database"));
        }

        if (!tweet) {
            return res.status(404).send(new ApiResponse(404, "Tweet not found"));
        }

      
        const newComment = {
            user: existingUser._id,
            comment: comment,
            commentedAt: new Date(), 
        };

    
        const updatedTweet = await TwitterPost.findByIdAndUpdate(
            tweetId,
            { $push: { comments: newComment } },
            { new: true }
        ).populate("comments.user", "username profileImage");

     
        if (!updatedTweet) {
            return res.status(404).send(new ApiResponse(404, "Tweet not found"));
        }

       
        return res.status(200).send(new ApiResponse(200, "Commented on tweet successfully", updatedTweet.comments));
    } catch (err) {
        console.error("Error in commenting on tweet:", err);
        return res.status(500).send(new ApiResponse(500, "Error in commenting on tweet", err.message));
    }
});


const TweetCommentSender = asyncHandler(async (req, res) => {
    const username = req.user.username;
    const { tweetId } = req.body;

    console.log("TweetId:", tweetId , username);

    if (!username || !tweetId) {
        return res.send(new ApiResponse(400, "Please provide username and tweetId"));
    }

    const tweet = await TwitterPost.findById(tweetId)
        .populate("comments.user", "username");

    if (!tweet) {
        return res.send(new ApiResponse(404, "Tweet not found"));
    }

    const commentsWithProfileImages = await Promise.all(
        tweet.comments.map(async (comment) => {
            const commenterUser = await User.findOne({ username: comment.user.username }, "ProfilePicture");
            return {
                comment: comment.comment,
                commentedAt: comment.commentedAt,
                username: comment.user.username,
                userphoto: commenterUser ? commenterUser.ProfilePicture : ""
            };
        })
    );

    return res.send(new ApiResponse(200, "Successfully fetched comments from backend", commentsWithProfileImages));
});


export {
    UserPostController,
    sendTweetsToUser,
    TweetLikeController,
    TweetCommentController,
    TweetCommentSender
}