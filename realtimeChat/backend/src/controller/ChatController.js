import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import User from '../models/User.Model.js';

const SendMessageRequest = asyncHandler(async (req, res) => {
    const senderName = req.user.username;
    const receiverName = req.body.receiverName;
    const requestedTo = await User.findOne({ username: receiverName });
    if (!requestedTo) {
        res.status(404);
        throw new Error('Receiver user not found');
    }
    const sender = await User.findOne({ username: senderName });
    if (!sender) {
        res.status(404);
        throw new Error('Sender user not found');
    }
    const alreadyFriends = requestedTo.friends.includes(sender._id);
    if (alreadyFriends) {
        console.log('You are already friends');
        return res.send(
            new ApiResponse(400, 'You are already friends')
        );
    }

    const existingRequest = requestedTo.friendRequests.find(
        (request) => request.from.toString() === sender._id.toString()
    );
    if (existingRequest) {
        console.log('Friend request already sent');
        return res.send(
            new ApiResponse(400, 'Friend request already sent')
        );
    }
    const friendRequest = {
        from: sender._id,
    };
    requestedTo.friendRequests.push(friendRequest);
    await requestedTo.save();

    res.send(new ApiResponse(200, 'Friend request sent successfully'));
});


const SeeFriendRequests = asyncHandler(async (req, res) => {
    const username = req.user.username;
  
    const existingUser = await User.findOne({ username }).populate({
      path: "friendRequests.from",
      select: "username profilePic", 
    });
  
    if (!existingUser) {
      console.log("User not found in database");
      return res.send(new ApiResponse(404, "User not found"));
    }

    const friendRequests = existingUser.friendRequests.map((request) => ({
      Username: request.from?.username || "Unknown", 
      ProfilePic: request.from?.profilePic || "/default-avatar.png",
      time:request.createdAt
    }));
    console.log(friendRequests);
  
    res.json(
      new ApiResponse(200, "Friend requests fetched successfully", {
        friendRequests,
      })
    );
  });

  const acceptRejectRequest = asyncHandler(async (req, res) => {
    const username = req.user.username;  
    const { action, requestUser } = req.params;  

    if (!action || !requestUser) {
        return res.status(400).send(new ApiResponse(400, "Action and requestUser are required"));
    }
    if (action !== 'accept' && action !== 'reject') {
        return res.status(400).send(new ApiResponse(400, "Invalid action"));
    }

    const user = await User.findOne({ username }).populate('friendRequests.from', 'username profilePic');
    if (!user) {
        return res.status(404).send(new ApiResponse(404, "User not found"));
    }
    const requestSender = await User.findOne({ username: requestUser });
    if (!requestSender) {
        return res.status(404).send(new ApiResponse(404, "Request sender not found"));
    }
    const existingRequestIndex = user.friendRequests.findIndex(
        (request) => request.from.username === requestUser
    );

    if (existingRequestIndex === -1) {
        return res.status(400).send(new ApiResponse(400, "No pending friend request found"));
    }
    if (action === 'accept') {
      user.friends.push(requestSender._id); 
      requestSender.friends.push(user._id); 
  
      user.friendRequests.splice(existingRequestIndex, 1);
      await user.save();
      await requestSender.save();
  
      return res.send(
          new ApiResponse(200, "Friend request accepted successfully")
      );
  }
    if (action === 'reject') {
        user.friendRequests.splice(existingRequestIndex, 1);
        await user.save();
        return res.send(
          new ApiResponse(200, "Friend request rejected successfully")
        )
    }
});

const showFriendsList = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!req.user) {
        return res.status(401).json(new ApiResponse(401, 'Unauthorized: Valid user required'));
    }

    const existingUser = await User.findOne({ username }).populate('friends', 'username profilePic');

    if (!existingUser) {
        return res.status(404).json(new ApiResponse(404, 'User not found in database'));
    }
    console.log(existingUser.friends)
    return res.status(200).json(new ApiResponse(200, 'Friends list retrieved successfully', existingUser.friends));
});

const seeActiveUsers=asyncHandler (async (req,res)=>{
const user=req.user.username

const existingUser=User.findOne({username:user})

if (!existingUser){
    return res.send(
        new ApiResponse(400,'user not found in database')
    )
}



})


export { 
    SendMessageRequest,
    SeeFriendRequests,
    acceptRejectRequest
    ,showFriendsList,
    seeActiveUsers

 };
