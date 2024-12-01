function handleSocketConnection(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (username) => {
      socket.join(username);
      console.log(`User ${socket.id} joined room: ${username}`);
      socket.emit('room-joined', username);
    });
 
    socket.on('send_message', (data) => {
      const { message, username } = data;
      console.log(`Message from ${socket.id} to user ${username}: ${message}`);
      io.to(username).emit('receive_message', { message, sender: socket.id });
    });
    socket.on('typing', ({ username, isTyping }) => {
      socket.to(username).emit('user_typing', { sender: socket.id, isTyping });
    });

    socket.on('message-seen', (messageId) => {
      io.emit('message-seen', messageId);
    });
    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    });
  });
}

export default handleSocketConnection;
