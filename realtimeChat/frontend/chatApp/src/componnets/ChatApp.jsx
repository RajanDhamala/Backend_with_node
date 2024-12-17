import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');  // Ensure this URL matches your server address

function ChatApp() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [friendUsername, setFriendUsername] = useState('');
  const [roomJoined, setRoomJoined] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [error, setError] = useState('');

  // Function to join the room
  const joinRoom = () => {
    if (username.trim() && friendUsername.trim()) {
      socket.emit('join_room', { username, friendUsername });
      console.log('Joining room:', username, friendUsername);
    }
  };

  // Send message to the friend
  const sendMessage = () => {
    if (message.trim() && username.trim()) {
      socket.emit('send_message', { username: friendUsername, message, senderUsername: username });
      setMessage('');
      console.log('Message sent:', message);
    }
  };

  // Typing status
  const handleTyping = (e) => {
    setMessage(e.target.value);
  };

  // Listen for server responses
  useEffect(() => {
    // Listen for room join confirmation
    socket.on('room-joined', (data) => {
      console.log(data);
      alert(data.message);
      setRoomJoined(true);
      setError(''); // Clear error messages
    });

    // Listen for error if the user tries to join without friendship
    socket.on('room-error', (data) => {
      console.log(data);
      setError(data.message);
      setRoomJoined(false);
    });

    // Listen for connection status updates
    socket.on('connection-status', (data) => {
      setConnectionStatus(data.message);
    });

    // Listen for received messages
    socket.on('receive_message', (data) => {
      console.log('Received message:', data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('room-joined');
      socket.off('room-error');
      socket.off('connection-status');
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
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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

      {connectionStatus && <div className="text-green-500 mb-4">{connectionStatus}</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded-md text-white ${
              msg.sender === username ? 'bg-blue-500 self-end' : 'bg-green-500 self-start'
            }`}
            style={{ maxWidth: '70%' }}
          >
            {msg.message}
          </div>
        ))}
      </div>

      {roomJoined && (
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            className="flex-grow focus:outline-none border-2 px-4 py-2 rounded-md bg-gray-200"
            placeholder="Enter message"
            value={message}
            onChange={handleTyping}
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
