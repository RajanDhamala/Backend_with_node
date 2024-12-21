import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import moment from 'moment'; // Import moment.js for time formatting

const socket = io('http://localhost:8000', {
  withCredentials: true,
});

function ChatApp() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [friendUsername, setFriendUsername] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [typing, setTyping] = useState(false);
  const chatContainerRef = useRef(null);

  let typingTimeout = useRef(null);
  let debounceTimer = useRef(null);

  useEffect(() => {
    const fetchActiveChats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/activeChats', {
          withCredentials: true,
        });
        const { statusCode, data } = response.data;
        if (statusCode === 200) {
          setActiveChats(data.activeChats);
        } else {
          console.error('Failed to fetch active chats');
          setActiveChats([]);
        }
      } catch (error) {
        console.error('Error fetching active chats:', error);
        setActiveChats([]);
      }
    };

    fetchActiveChats();
  }, []);

  const fetchChatMessages = async (receiver) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/getChats/${receiver}/10`, {
        withCredentials: true,
      });
      const { statusCode, data } = response.data;
      if (statusCode === 200) {
        setMessages(data.messages);
      } else {
        console.error('Failed to fetch messages for the chat');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setMessages([]);
    }
  };

  const handleSelectChat = (username) => {
    setFriendUsername(username);
    setSelectedChat(username);
    setMessages([]); // Clear previous messages while loading new ones
    fetchChatMessages(username); // Load the previous messages for the selected chat
  };

  const saveChatInDatabase = async () => {
    try {
      if (!friendUsername) {
        console.error('Receiver (friendUsername) is missing');
        return;
      }

      const response = await axios.post('http://localhost:8000/api/saveChats', {
        receiver: friendUsername,
        message: message,
      }, { withCredentials: true });

      const { statusCode } = response.data;
      if (statusCode === 200) {
        console.log('Chat saved successfully');
      } else {
        console.error('Failed to save chat');
      }
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const sendMessage = () => {
    if (message.trim() && selectedChat) {
      saveChatInDatabase();
      socket.emit('send_message', { friendUsername: selectedChat, message });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: { username: 'you' },
          message,
          timestamp: new Date().toISOString(),
        },
      ]);
      setMessage('');
    } else {
      console.error('Message or selected chat is missing');
    }
  };

  const handleTyping = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      socket.emit('typing', { friendUsername: selectedChat });
    }, 200);

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stop_typing', { friendUsername: selectedChat });
    }, 1500);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: data.sender,
          message: data.message,
          timestamp: data.timestamp,
        },
      ]);
    });

    socket.on('typing', (data) => {
      if (data.sendername === selectedChat) {
        setTyping(true);
      }
    });

    socket.on('stop_typing', (data) => {
      if (data.sendername === selectedChat) {
        setTyping(false);
      }
    });

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('stop_typing');
    };
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r bg-gray-100">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Chats</h1>
        </div>
        <ul className="overflow-y-auto h-full">
          {(activeChats || []).map((chat) => (
            <li
              key={chat.chatId}
              className={`p-4 cursor-pointer hover:bg-gray-200 ${selectedChat === chat.participants[0].username ? 'bg-blue-100' : ''}`}
              onClick={() => handleSelectChat(chat.participants[0].username)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={chat.participants[0].profilePic || '/default-avatar.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-bold">{chat.participants[0].username}</div>
                  <div className="text-sm text-gray-500">Last message preview...</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 flex flex-col">
        <div className="p-4 border-b bg-white flex items-center">
          {selectedChat ? (
            <div>
              <h2 className="text-lg font-bold">{selectedChat}</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          ) : (
            <h2 className="text-lg font-bold">Select a chat</h2>
          )}
        </div>

        <div className="flex-grow p-4 overflow-y-auto bg-gray-50" ref={chatContainerRef}>
          {selectedChat ? (
            <>
              {(messages || []).map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 mb-2 rounded-md text-white ${
                    msg.sender.username === 'you' ? 'bg-blue-500 self-end' : 'bg-green-500 self-start'
                  }`}
                  style={{ maxWidth: '70%' }}
                >
                  <strong>{msg.sender.username}:</strong> {msg.message}
                  <div className="text-xs text-gray-300 mt-1">
                    {moment(msg.timestamp).format('hh:mm A')}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center">
                  <span className="loading loading-dots loading-sm"></span>
                  <span className="text-sm text-gray-500 italic ml-2">{selectedChat} is typing...</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500 italic">No chat selected</div>
          )}
        </div>

        {selectedChat && (
          <div className="p-4 border-t bg-white flex gap-2">
            <input
              type="text"
              className="flex-grow border-2 px-4 py-2 rounded-md focus:outline-none"
              placeholder="Type a message..."
              value={message}
              onChange={handleTyping}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatApp;
