import CheckFriendship from '../utils/ChatUtils.js';
import User from '../models/User.Model.js';
import socketJwtMiddleware from '../middleware/socket.ioMiddlewares/socket.Jwt.js';

function handleSocketConnection(io) {
    io.use(socketJwtMiddleware);

    const users = {}; 

    io.on('connection', async (socket) => {
        const { username } = socket.user;

        if (users[username]) {
            console.log(`User ${username} is already connected, rejecting new connection.`);
            socket.emit('error', { message: 'You are already connected' }); 
            socket.disconnect();
            return;
        }

        console.log(`User connected: ${socket.id}, Username: ${username}`);
        users[username] = socket.id; 

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
            const recipientSocketId = users[friendUsername];

            if (isFriend) {
                socket.join(friendUsername);
                console.log(`User ${socket.id} joined room with ${friendUsername}`);
                io.to(recipientSocketId).emit('room-joined', { username });
                io.to(socket.id).emit('room-joined', { username: friendUsername });
            } else {
                console.log(`Unauthorized room join attempt by ${username} with ${friendUsername}`);
                io.to(socket.id).emit('unauthorized-room-join', { friendUsername });
            }
        });
 socket.on('send_message', ({ friendUsername, message, timestamp,chatId }) => {
    const recipientSocketId = users[friendUsername];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('message', {
        'sendername':username,
        'receivername': friendUsername,
        message,
        chatId,
        timestamp,
      });
    }
  });

        socket.on('typing', async ({ friendUsername }) => {
            const recipientSocketId = users[friendUsername];
            if (!friendUsername) {
                return;
            }
            console.log(`${username} is typing...`);
            io.to(recipientSocketId).emit('typing', { 'sendername': username, 'typing': true });
        });

        socket.on('stop_typing', async ({ friendUsername }) => {
            const recipientSocketId = users[friendUsername];
            if (!friendUsername) {
                return;
            }
            console.log(`${username} stopped typing...`);
            io.to(recipientSocketId).emit('stop_typing', { 'sendername': username, 'typing': false });
        });

        socket.on('disconnect', async (reason) => {
            console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
            if (users[username]) {
                delete users[username]; 
            }
            console.log(users);
            socket.broadcast.emit('stop_typing', { sendername: username });
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
