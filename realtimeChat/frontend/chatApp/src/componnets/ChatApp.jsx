import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

function ChatApp() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingNotification, setTypingNotification] = useState('');
  const [isSeen, setIsSeen] = useState(false);

  const joinRoom = () => {
    if (username.trim()) {
      socket.emit('join_room', username);
    }
  };

  const sendMessage = () => {
    if (message.trim() && username.trim()) {
      socket.emit('send_message', { username, message });
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { username, isTyping: true });
    }

    setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', { username, isTyping: false });
    }, 2000);
  };

  const handleMessageSeen = (messageId) => {
    socket.emit('message-seen', { messageId, username });
    setIsSeen(true);
  };

  useEffect(() => {
    socket.on('room-joined', (username) => {
      alert(`You joined chat with: ${username}`);
    });

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('user_typing', ({ sender, isTyping }) => {
      if (isTyping) {
        setTypingNotification('User is typing...');
      } else {
        setTypingNotification('');
      }
    });

    socket.on('message-seen', (data) => {
      const updatedMessages = messages.map((msg) =>
        msg.id === data.messageId ? { ...msg, seenBy: data.seenBy } : msg
      );
      setMessages(updatedMessages);
    });

    return () => {
      socket.off('room-joined');
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('message-seen');
    };
  }, [messages]);

  return (
    <div className="px-5 py-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat Application</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-grow focus:outline-none border-2 px-4 py-2 rounded-md bg-gray-200"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="rounded-md bg-blue-500 text-white hover:bg-blue-600 px-4 py-2"
          onClick={joinRoom}
        >
          Join Chat
        </button>
      </div>

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
            <div className="text-xs text-gray-500">
              {msg.seenBy ? `Seen by: ${msg.seenBy.join(', ')}` : 'Not seen yet'}
            </div>
            {msg.sender !== socket.id && (
              <button
                className="text-xs text-blue-500 mt-1"
                onClick={() => handleMessageSeen(msg.id)}
              >
                Mark as Seen
              </button>
            )}
          </div>
        ))}
      </div>

      {typingNotification && (
        <div className="text-gray-500 mt-2">
          <em>{typingNotification}</em>
        </div>
      )}

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
    </div>
  );
}

export default ChatApp;
