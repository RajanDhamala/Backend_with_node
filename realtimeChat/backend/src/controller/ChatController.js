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

const createChatDatabase = asyncHandler(async (req, res) => {
  console.log("Chat initiation request received.");

  const { receiver, message } = req.params;
  const sender = req.user.username;

  if (!receiver || !message) {
    return res.status(400).send(new ApiResponse(400, "Receiver and message are required"));
  }

  if (!sender) {
    return res.status(400).send(new ApiResponse(400, "Sender not found"));
  }

  const [senderUser, receiverUser] = await Promise.all([
    User.findOne({ username: sender }),
    User.findOne({ username: receiver }),
  ]);

  if (!senderUser || !receiverUser) {
    return res.status(404).send(new ApiResponse(404, "Sender or receiver not found"));
  }

  let chat = await Chat.findOne(
    { participants: { $all: [senderUser._id, receiverUser._id] } }
  ).select("_id");

  if (chat) {
    console.log("Chat already exists:", chat);
    return res.status(200).send(new ApiResponse(200, "Chat already exists"));
  }

  chat = new Chat({
    participants: [senderUser._id, receiverUser._id],
    messages: [{ sender: senderUser._id, message }],
  });

  await chat.save();

  senderUser.activeChats.push(chat._id);
  receiverUser.activeChats.push(chat._id);
  await Promise.all([senderUser.save(), receiverUser.save()]);

  console.log("New chat created:", chat);
  return res.status(201).send(new ApiResponse(201, "Chat initiated successfully"));
});


  const getActiveChats = asyncHandler(async (req, res) => {
    const username = req.user.username;
  
    if (!username) {
      return res.status(400).send(
        new ApiResponse(400, 'Invalid cookie or user not found in database')
      );
    }
  
    const existingChats = await User.findOne({ username }).populate({
      path: 'activeChats',
      populate: {
        path: 'participants',
        select: 'username profilePic',
      },
    });
  
    if (!existingChats || existingChats.activeChats.length === 0) {
      return res.status(400).send(
        new ApiResponse(400, 'No active chats found')
      );
    }
  

    const activeChats = existingChats.activeChats.map(chat => ({
      chatId: chat._id,
      participants: chat.participants
        .filter(participant => participant.username !== username) 
        .map(participant => ({
          username: participant.username,
          profilePic: participant.profilePic,
        })),
    }));
  
    return res.status(200).send(
      new ApiResponse(200, 'Active chats', { activeChats })
    );
  });

  const saveChats = asyncHandler(async (req, res) => {
    const senderId = req.user.id; 
    const { receiver, message } = req.body;
  
    console.log("sender", senderId, receiver, message);
  
    if (!receiver || !message) {
      return res.status(400).send(
        new ApiResponse(400, 'Receiver and message are required')
      );
    }
  
    const receiverUser = await User.findOne({ username: receiver })
      .populate('activeChats')
      .select('activeChats username');
  
    if (!receiverUser) {
      return res.status(404).send(
        new ApiResponse(404, `Receiver '${receiver}' not found`)
      );
    }
  
    const existingChat = await Chat.findOne({
      participants: { $all: [senderId, receiverUser._id] },
    });
  
    if (!existingChat) {
      return res.status(400).send(
        new ApiResponse(400, 'Chat not found. Contact the administrator for access')
      );
    }
  
    existingChat.messages.push({
      sender: senderId,
      message,
    });
  
    await existingChat.save();
    return res.status(200).send(
      new ApiResponse(200, `Message sent successfully to ${receiver}`)
    );
  });

  const getChats = asyncHandler(async (req, res) => {
    const username = req.user.username;
    const receiver = req.params.receiver;
    const sizeofChat = parseInt(req.params.size || 20);
  
    if (!receiver) {
      return res.status(400).send(new ApiResponse(400, 'Receiver is required'));
    }
  
    const receiverUser = await User.findOne({ username: receiver }).select('_id');
    if (!receiverUser) {
      return res.status(404).send(new ApiResponse(404, 'Receiver not found'));
    }
  
    const receiverId = receiverUser._id;
  
    const existingChat = await Chat.findOne({
      participants: { $all: [req.user.id, receiverId] },
    })
      .populate('participants', 'username')
      .populate('messages.sender', 'username profilePic')
      .populate('messages.status.participant', 'username')
      .select({
        messages: { $slice: [-sizeofChat, sizeofChat] } 
      })
      .lean();
  
    if (!existingChat) {
      return res.status(404).send(new ApiResponse(404, 'Chat not found'));
    }
  
    console.log(existingChat);
    return res.status(200).send(new ApiResponse(200, 'Chat found', { existingChat, currentUser: username }));
  });
  
  

  const validateAllActiveChats = asyncHandler(async (req, res) => {
    const users = await User.find();
    let cleanedUsers = 0;
    let removedChatsCount = 0;

    for (const user of users) {
      const activeChats = user.activeChats;
      if (!activeChats || activeChats.length === 0) continue;
  
      const validChats = await Chat.find({ _id: { $in: activeChats } }).select("_id");
      const validChatIds = validChats.map(chat => chat._id.toString());
  
      const invalidChats = activeChats.filter(chatId => !validChatIds.includes(chatId.toString()));
      
      if (invalidChats.length > 0) {
        console.log(`User ${user.username} has invalid chats:`, invalidChats);
        user.activeChats = validChatIds;
        await user.save();
        cleanedUsers++;
        removedChatsCount += invalidChats.length;
      }
    }
  
    return res.status(200).send(
      new ApiResponse(200, "Chat validation completed", {
        cleanedUsers,
        removedChatsCount,
      })
    );
  });

  const handelLocalStorage = asyncHandler(async (req, res) => {
    const username = req.user.username;
    const size = parseInt(req.params.size) || 10; // Default size of 10
  
    if (!username) {
      return res.send(
        new ApiResponse(400, 'Invalid cookie or user not found in database')
      );
    }
  
    const user = await User.findOne({ username })
      .populate({
        path: 'activeChats',
        populate: {
          path: 'participants',
          select: 'username profilePic -_id',
        },
      })
      .populate({
        path: 'activeChats',
        populate: {
          path: 'messages',
          options: {
            sort: { timestamp: -1 },
          },
          populate: {
            path: 'sender',
            select: 'username -_id',
          },
        },
      });
  
    if (!user) {
      return res.send(
        new ApiResponse(404, 'User not found')
      );
    }
  
    
    user.activeChats.forEach(chat => {
      if (chat.messages && chat.messages.length > size) {
        chat.messages.reverse(); 
        chat.messages = chat.messages.slice(0, size);
        chat.messages.reverse();
      }
    });
  
    res.send(
      new ApiResponse(200, 'Chats and messages retrieved successfully', user.activeChats)
    );
  });

  const getAllActiveUsers=asyncHandler(async (req,res)=>{
    const requser=req.user.username
    console.log('who are u?')

    if (!requser){
        return res.send(
            new ApiResponse(400,'user not found in database')
        )
    }

    const allusers=await User.find({isActive:true}).select('username profilePic verifiedUser')
    console.log(allusers)
    res.send(
        new ApiResponse(200,'response',allusers)
    )
  })

export { 
    SendMessageRequest,
    SeeFriendRequests,
    acceptRejectRequest
    ,showFriendsList,
    seeActiveUser,
    handelChatInitiation,
    createChatDatabase,
    getActiveChats,
    saveChats,
    getChats,
    validateAllActiveChats,
    handelLocalStorage,
    getAllActiveUsers
 };
