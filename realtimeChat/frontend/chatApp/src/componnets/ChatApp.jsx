import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

function ChatApp() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [roomCreated, setRoomCreated] = useState(''); // Store the created room ID

 
  const createRoom = () => {
    socket.emit('create-room');
  };

 
  const joinRoom = () => {
    if (room.trim()) {
      socket.emit('join_room', room);
    }
  };

  
  const sendMessage = () => {
    if (message.trim() && room.trim()) {
      socket.emit('send_message', { room, message });
      setMessage('');
    }
  };

  useEffect(() => {
   
    socket.on('room-created', (roomId) => {
      setRoomCreated(roomId);
      alert(`Room created with ID: ${roomId}`);
     
      socket.emit('join_room', roomId);
      setRoom(roomId); 
    });

   
    socket.on('room-joined', (room) => {
      alert(`You joined room: ${room}`);
    });

   
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    
    socket.on('error', (data) => {
      alert(data.message);
    });

    return () => {
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('receive_message');
      socket.off('error');
    };
  }, []);

  return (
    <div className="px-5 py-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat Application</h1>

      {/* Create or Join Room Section */}
      <div className="flex gap-2 mb-4">
        <button
          className="rounded-md bg-green-500 text-white hover:bg-green-600 px-4 py-2"
          onClick={createRoom}
        >
          Create Room
        </button>
        <input
          type="text"
          className="flex-grow focus:outline-none border-2 px-4 py-2 rounded-md bg-gray-200"
          placeholder="Enter room ID to join"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button
          className="rounded-md bg-blue-500 text-white hover:bg-blue-600 px-4 py-2"
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>

      {/* Show created room ID */}
      {roomCreated && (
        <div className="bg-green-200 text-green-800 p-2 rounded-md mb-4">
          <strong>Room Created:</strong> {roomCreated}
        </div>
      )}

      {/* Messages List */}
      <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded-md text-white ${
              msg.sender === socket.id ? 'bg-blue-500 self-end' : 'bg-green-500 self-start'
            }`}
            style={{ maxWidth: '70%' }}
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          className="flex-grow focus:outline-none border-2 px-4 py-2 rounded-md bg-gray-200"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="rounded-md bg-blue-500 text-white hover:bg-blue-600 px-4 py-2"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatApp;
