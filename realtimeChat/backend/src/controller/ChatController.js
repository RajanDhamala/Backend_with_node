import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import User from '../models/User.js';
import Chat from '../models/Group.Model.j'


const SendFriendRequest = asyncHandler(async (req, res) => {

    const { senderName, receiverName } = req.body;
    const requestedTo=await User.findbyId(receiverName);

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

    res.json({ message: 'Friend Request Sent' });
});

const AcceptFriendRequest = asyncHandler(async (req, res) => {

  
})

export { 
    SendFriendRequest,
    AcceptFriendRequest


 };
