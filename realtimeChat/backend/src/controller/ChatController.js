import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import User from '../models/User.Model.js';

const SendMessageRequest = asyncHandler(async (req, res) => {

    const senderName=req.user.username;
    const receiverName=req.body.receiverName;

    const requestedTo=await User.findOne({username:receiverName});

    if (!requestedTo) {
        res.status(404);
        throw new Error('reciever User not found');
    }
    const sender=await User.findOne({username:senderName});
    if(!sender){
        res.status(404);
        throw new Error('sender User not found');
    }
    const friendRequest = {
        from: sender._id,
        status: 'pending'
    };
    requestedTo.friendRequests.push(friendRequest);
    requestedTo.save();

    res.json(new ApiResponse(200, 'Friend request sent successfully', requestedTo.friendRequests));
});

const AcceptFriendRequest = asyncHandler(async (req, res) => {

  
})

export { 
    SendMessageRequest,
 };
