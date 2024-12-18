import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000', {
  withCredentials: true,
});

function ChatApp() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [friendUsername, setFriendUsername] = useState('');
  const [roomJoined, setRoomJoined] = useState(false);
  const [error, setError] = useState('');


  const joinRoom = () => {
    if (friendUsername.trim()) {
      socket.emit('join_room', { friendUsername });
      console.log('Joining room with friend:', friendUsername);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { recipient: friendUsername, message });
      setMessage('');
      console.log('Message sent:', message);
    }
  };

  useEffect(() => {

    socket.on('room-joined', (data) => {
      console.log(data);
      alert(data.message);
      setRoomJoined(true);
      setError('');
    });
  

    socket.on('room-error', (data) => {
      console.log(data);
      setError(data.message);
      setRoomJoined(false);
    });
  

    socket.on('receive_message', (data) => {
      console.log('Received message:', data);
      alert(`New message from ${data.sender}: ${data.message}`); 
      setMessages((prev) => [...prev, data]);
    });
  
    return () => {
      socket.off('room-joined');
      socket.off('room-error');
      socket.off('receive_message');
    };
  }, []);

  return (
    <div className="px-5 py-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat Application</h1>


      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-grow focus:outline-none border-2 px-4 py-2 rounded-md bg-gray-200"
          placeholder="Enter friend's username"
          value={friendUsername}
          onChange={(e) => setFriendUsername(e.target.value)}
        />
        <button
          className="rounded-md bg-blue-500 text-white hover:bg-blue-600 px-4 py-2"
          onClick={joinRoom}
        >
          Join Chat
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded-md text-white ${
              msg.sender === socket.user?.username ? 'bg-blue-500 self-end' : 'bg-green-500 self-start'
            }`}
            style={{ maxWidth: '70%' }}
          >
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>

      {/* Message input and send button */}
      {roomJoined && (
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
      )}
    </div>
  );
}

export default ChatApp;
