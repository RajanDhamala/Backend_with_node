const rooms = [];

const generateRoomId = () => {
  let roomId;
  do {
    roomId = Math.floor(1000 + Math.random() * 9000).toString();
  } while (rooms.includes(roomId));
  
  rooms.push(roomId);
  return roomId;
};

function handleSocketConnection(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('create-room', () => {
      const roomId = generateRoomId();
      socket.emit('room-created', roomId);
      console.log(`Room created with ID: ${roomId}`);
    });

    socket.on('join_room', (room) => {
      if (rooms.includes(room)) {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
        socket.emit('room-joined', room); 
      } else {
        socket.emit('error', { message: 'Room does not exist' });
      }
    });
  // Handle sending messages to a room
    socket.on('send_message', (data) => {
      const { message, room } = data;
      console.log(`Message from ${socket.id} to room ${room}: ${message}`);

  
      io.to(room).emit('receive_message', { message, sender: socket.id });
    });


    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    });
  });
}

export default handleSocketConnection;
