import CheckFriendship from '../utils/ChatUtils.js';

function handleSocketConnection(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

   
    socket.on('join_room', async ({ username, friendUsername }) => {
      const isFriend = await CheckFriendship(username, friendUsername);
console.log(isFriend);
      if (isFriend) {
        socket.join(friendUsername);
        console.log(`User ${socket.id} joined room with ${friendUsername}`);
        socket.emit('room-joined', { message: `${username} has joined the room`});

        io.to(friendUsername).emit('room-joined', { message: `${username} has joined the room` });
      } else {
        console.log(`User ${socket.id} tried to join room with ${friendUsername}, but they are not friends.`);
        socket.emit('room-error', { message: "You can only chat with friends" });
      }
    });

    socket.on('send_message', (data) => {
      const { message, username, senderUsername } = data;
      console.log(`Message from ${senderUsername} to ${username}: ${message}`);

      io.to(username).emit('receive_message', { message, sender: senderUsername });
    });

    socket.on('typing', ({ username, isTyping }) => {
      socket.to(username).emit('user_typing', { sender: socket.id, isTyping });
    });
    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    });
  });
}

export default handleSocketConnection;
