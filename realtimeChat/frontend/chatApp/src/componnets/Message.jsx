import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); 

function ChatApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageRequests, setMessageRequests] = useState([]);


  const searchUsers = async () => {
    const allUsers = ['john', 'alice', 'bob'];
    const result = allUsers.filter(user => user.includes(searchTerm));
    setUsers(result);
  };

  useEffect(() => {
    socket.on('message_request_received', (sender) => {
      setMessageRequests((prev) => [...prev, { sender, status: 'pending' }]);
    });

    socket.on('message_request_accepted', (user) => {
      setMessages((prev) => [...prev, { sender: 'System', text: `${user} accepted your message request` }]);
    });

    socket.on('message_request_rejected', (user) => {
      setMessages((prev) => [...prev, { sender: 'System', text: `${user} rejected your message request` }]);
    });

    return () => {
      socket.off('message_request_received');
      socket.off('message_request_accepted');
      socket.off('message_request_rejected');
    };
  }, []);

  const sendMessageRequest = (receiver) => {
    const sender = 'john'; 
    socket.emit('send_message_request', sender, receiver);
  };

  const acceptRequest = (sender) => {
    const receiver = 'john';
    socket.emit('accept_message_request', sender, receiver);
  };

  const rejectRequest = (sender) => {
    const receiver = 'john';
    socket.emit('reject_message_request', sender, receiver);
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
