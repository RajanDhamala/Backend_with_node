import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function ChatApp() {
  const [socket, setSocket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageRequests, setMessageRequests] = useState([]);

  useEffect(() => {

    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    newSocket.on('message_request_received', (sender) => {
      setMessageRequests((prev) => [...prev, { sender, status: 'pending' }]);
    });

    newSocket.on('connect_error', (err) => {
      console.error("Socket connection error:", err);
    });

    newSocket.on('disconnect', (reason) => {
      console.log("Disconnected from server:", reason);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const searchUsers = async () => {
    const allUsers = ['john', 'alice', 'bob'];
    const result = allUsers.filter((user) => user.includes(searchTerm));
    setUsers(result);
  };

  const sendMessageRequest = (receiver) => {
    const sender = 'john'; // Replace with dynamic username
    if (socket) {
      socket.emit('send_message_request', sender, receiver);
    }
  };

  const acceptRequest = (sender) => {
    const receiver = 'john'; // Replace with dynamic username
    if (socket) {
      socket.emit('accept_message_request', sender, receiver);
    }
  };

  const rejectRequest = (sender) => {
    const receiver = 'john'; // Replace with dynamic username
    if (socket) {
      socket.emit('reject_message_request', sender, receiver);
    }
  };

  return (
    <div className="chat-app">
      <h1>Chat</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users"
      />
      <button onClick={searchUsers}>Search</button>

      <div>
        <h2>Search Results</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user}
              <button onClick={() => sendMessageRequest(user)}>Send Request</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Message Requests</h2>
        <ul>
          {messageRequests.map((request, index) => (
            <li key={index}>
              {request.sender}
              {request.status === 'pending' && (
                <>
                  <button onClick={() => acceptRequest(request.sender)}>Accept</button>
                  <button onClick={() => rejectRequest(request.sender)}>Reject</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Messages</h2>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}</strong>: {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatApp;
