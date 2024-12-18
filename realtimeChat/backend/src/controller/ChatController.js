import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import User from '../models/User.Model.js';
import  Checkfriedshipfrom from '../utils/ChatUtils.js'
import Chat from '../models/Group.Model.js';

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
    console.log(username, action, requestUser); 

    if (!action || !requestUser) {
        return res.status(400).send(new ApiResponse(400, "Action and requestUser are required"));
    }

    if (action !== 'accept' && action !== 'reject') {
        return res.status(400).send(new ApiResponse(400, "Invalid action"));
    }
    const user = await User.findOne({ username }).populate('friendRequests.from', '_id username profilePic');
    if (!user) {
        return res.status(404).send(new ApiResponse(404, "User not found"));
    }
    const requestSender = await User.findOne({ username: requestUser });
    if (!requestSender) {
        return res.status(404).send(new ApiResponse(404, "Request sender not found"));
    }

    const existingRequestIndex = user.friendRequests.findIndex(
        (request) => request.from._id.toString() === requestSender._id.toString()
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

        return res.send(new ApiResponse(200, "Friend request accepted successfully"));
    }

    if (action === 'reject') {
        user.friendRequests.splice(existingRequestIndex, 1);
        await user.save();
        return res.send(new ApiResponse(200, "Friend request rejected successfully"));
    }
});


const showFriendsList = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!req.user) {
        return res.status(401).json(new ApiResponse(401, 'Unauthorized: Valid user required'));
    }

    const existingUser = await User.findOne({ username }).populate('friends', 'username profilePic isActive');

    if (!existingUser) {
        return res.status(404).json(new ApiResponse(404, 'User not found in database'));
    }
    console.log(existingUser.friends)
    return res.status(200).json(new ApiResponse(200, 'Friends list retrieved successfully', existingUser.friends));
});


const seeActiveUser=asyncHandler(async (req,res)=>{
const {username}=req.params
const user=req.user.username

const existingUser=User.findOne({username:user})

if (!existingUser){
    return res.send(
        new ApiResponse(400,'user not found in database')
    )
}
const CheckifUserActive=await User.findOne({username}).select('isActive -_id')

res.send(new ApiResponse(200,'response',CheckifUserActive))
})


const handelChatInitiation=asyncHandler(async (req,res)=>{
    const firstperson=req.user.username
    const {secondperson}=req.body

   const isfrand=await Checkfriedshipfrom(firstperson,secondperson)

   if(!isfrand){
       return res.send(
           new ApiResponse(400,'You are not friends')
       )
   }

   return res.send(
       new ApiResponse(200,'you are friends and now can proceed to chat')
   )
})

const createChatdtabase=asyncHandler(async (req,res)=>{
    const {receiver,message}=req.params
    const sender=req.user.username

    if(!receiver || !message){
        return res.send(
            new ApiResponse(400,'receiver and message are required')
        )
    }

    if(!sender){
        return res.send(
            new ApiResponse(400,'sender not found')
        )
    }

const senderUser = await User.findOne({ username: 'rijandhamala' });
const receiverUser = await User.findOne({ username: 'rajandhamala' });

if (!senderUser || !receiverUser) {
  return res.status(400).send('Sender or receiver not found');
}

let chat = await Chat.findOne({
  participants: {
    $all: [senderUser._id, receiverUser._id]
  }
});

if(!chat){
    chat = new Chat({
        participants: [senderUser._id, receiverUser._id],
      });
    await chat.save();
    console.log('New chat created:', chat);
    return res.send(new ApiResponse(200, 'Chat initiated successfully'));
}

chat.messages.push({
    sender: senderUser._id,
  });

  await chat.save();
  console.log('Message sent:', message);
  return res.status(200).send('Message sent');

})

export { 
    SendMessageRequest,
    SeeFriendRequests,
    acceptRejectRequest
    ,showFriendsList,
    seeActiveUser,
    handelChatInitiation,
    createChatdtabase
 };
