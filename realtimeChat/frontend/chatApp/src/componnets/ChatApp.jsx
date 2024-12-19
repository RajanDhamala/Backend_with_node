import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000', {
  withCredentials: true,
});

let typingTimeout;
let debounceTimer;

function ChatApp() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [friendUsername, setFriendUsername] = useState('');
  const [roomJoined, setRoomJoined] = useState(false);
  const [typing, setTyping] = useState(false);
  const username = 'you';
  const chatContainerRef = useRef(null);

  const joinRoom = () => {
    if (friendUsername.trim()) {
      socket.emit('join_room', { friendUsername });
      console.log(`Joining room with: ${friendUsername}`);
    }
  };

  const sendMessage = () => {
    if (message.trim() && roomJoined) {
      socket.emit('send_message', { friendUsername, message });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sendername: username, message },
      ]);
      setMessage('');
      console.log(`Message sent to ${friendUsername}: ${message}`);
    }
  };

  const handleTyping = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      socket.emit('typing', { friendUsername });
    }, 200);

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      socket.emit('stop_typing', { friendUsername });
    }, 1000);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    socket.on('room-joined', (data) => {
      console.log('Room joined:', data);
      alert(`Connected with ${data.username}`);
      setRoomJoined(true);
    });

    socket.on('message', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sendername: data.sendername, message: data.message },
      ]);
    });

    socket.on('typing', (data) => {
      if (data.sendername === friendUsername) {
        setTyping(true);
      }
    });

    socket.on('stop_typing', (data) => {
      if (data.sendername === friendUsername) {
        setTyping(false);
      }
    });

    return () => {
      socket.off('room-joined');
      socket.off('message');
      socket.off('typing');
      socket.off('stop_typing');
    };
  }, [friendUsername]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="px-5 py-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">1:1 Chat Application</h1>

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

      <div
        className="border rounded-lg p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col"
        ref={chatContainerRef}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded-md text-white ${
              msg.sendername === username ? 'bg-blue-500 self-end' : 'bg-green-500 self-start'
            }`}
            style={{ maxWidth: '70%' }}
          >
            <strong>{msg.sendername}:</strong> {msg.message}
          </div>
        ))}
        {typing && (
          <div className="text-sm text-gray-500 italic mb-2 self-start">
            {friendUsername} is typing...
          </div>
        )}
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
