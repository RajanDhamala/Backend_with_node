import CheckFriendship from '../utils/ChatUtils.js';
import User from '../models/User.Model.js';
import socketJwtMiddleware from '../middleware/socket.ioMiddlewares/socket.Jwt.js';

function handleSocketConnection(io) {
 
    io.use(socketJwtMiddleware);

    io.on('connection', async (socket) => {
        const { username } = socket.user; 
        console.log(`User connected: ${socket.id}, Username: ${username}`);
        if (username) {
            try {
                const usr = await User.findOneAndUpdate(
                    { username },
                    { isActive: true },
                    { new: true }
                );
                console.log(usr ? `${username} is now active` : `User ${username} not found`);
            } catch (err) {
                console.error(`Error updating user ${username}:`, err);
            }
        }

      
        socket.on('join_room', async ({ friendUsername }) => {
            const isFriend = await CheckFriendship(username, friendUsername);
            console.log(`Friendship status between ${username} and ${friendUsername}:`, isFriend);

            if (isFriend) {
                socket.join(friendUsername);
                console.log(`User ${socket.id} joined room with ${friendUsername}`);
                io.to(friendUsername).emit('room-joined', { message: `${username} has joined the room` });
            } else {
                console.log(`Unauthorized room join attempt by ${username} with ${friendUsername}`);
                socket.emit('room-error', { message: "You can only chat with friends" });
            }
        });

       
        socket.on('send_message', (data) => {
          const { message, recipient } = data;
          const sender = socket.user.username; 
          console.log(`Message from ${sender} to ${recipient}: ${message}`);
      
          io.to(recipient).emit('receive_message', { message, sender });
      });
   
        socket.on('typing', ({ recipient, isTyping }) => {
            socket.to(recipient).emit('user_typing', { sender: username, isTyping });
        });

        socket.on('disconnect', async (reason) => {
            console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
            if (username) {
                try {
                    const usr = await User.findOneAndUpdate(
                        { username },
                        { isActive: false },
                        { new: true }
                    );
                    console.log(usr ? `${username} is now offline` : `User ${username} not found`);
                } catch (err) {
                    console.error(`Error updating user ${username}:`, err);
                }
            }
        });
    });
}

export default handleSocketConnection;
