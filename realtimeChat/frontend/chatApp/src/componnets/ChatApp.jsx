import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import moment from 'moment';
import Cookies from 'js-cookie';
import { Send, Search } from 'lucide-react';

const useSocket = (url) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(url, { withCredentials: true });
    return () => socketRef.current?.close();
  }, [url]);

  return socketRef.current;
};

// Custom hook for managing chat storage
const useChatStorage = () => {
  const storeChats = (chatId, messages) => {
    try {
      sessionStorage.setItem(`Chat_${chatId}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error storing chats:', error);
    }
  };

  const getChats = (chatId) => {
    try {
      const chats = JSON.parse(sessionStorage.getItem(`Chat_${chatId}`));
      return Array.isArray(chats) ? chats : [];
    } catch (error) {
      console.error('Error retrieving chats:', error);
      return [];
    }
  };

  return { storeChats, getChats };
};

// Message bubble component
const MessageBubble = ({ message, isCurrentUser, senderImage, timestamp, username }) => (
  <div className={`flex items-end gap-2 mb-4 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
    <img
      src={senderImage || '/default-avatar.png'}
      alt={username}
      className="w-8 h-8 rounded-full"
    />
    <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
      <div className="text-xs text-gray-500 mb-1">{username}</div>
      <div
        className={`px-4 py-2 rounded-2xl ${
          isCurrentUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-green-500 text-white rounded-bl-none'
        }`}
      >
        {message.match(/(https?:\/\/[^\s]+)/g) ? (
          <a href={message} target="_blank" rel="noopener noreferrer" className="underline text-wrap">
            {message}
          </a>
        ) : (
          message
        )}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {moment(timestamp).format('hh:mm A')}
      </div>
    </div>
  </div>
);

// Chat list item component
const ChatListItem = ({ chat, loginUser, selectedChat, onSelect }) => {
  const otherParticipant = chat.participants.find(p => p?.username !== loginUser);
  if (!otherParticipant) return null;

  const isSelected = selectedChat === otherParticipant.username;
  const latestMessage = chat.messages[chat.messages.length - 1]?.message || 'No messages yet';

  return (
    <div
      onClick={() => onSelect(otherParticipant.username, chat.messages, chat._id, otherParticipant.profilePic)}
      className={`p-4 cursor-pointer transition-all hover:bg-gray-100 
        ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={otherParticipant.profilePic || '/default-avatar.png'}
            alt={otherParticipant.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{otherParticipant.username}</h3>
          <p className="text-sm text-gray-500 truncate">{latestMessage}</p>
        </div>
      </div>
    </div>
  );
};

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [amTyping, setAmTyping] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const [loginUserImage, setLoginUserImage] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [typing, setTyping] = useState(false);
  const [localData, setLocalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const chatContainerRef = useRef(null);
  const typingTimeout = useRef(null);
  const debounceTimer = useRef(null);
  const [chats, setChats] = useState(null);
  
  const socket = useSocket(`${import.meta.env.VITE_API_BASE_URL}`);
  const { storeChats, getChats } = useChatStorage();

  const saveMessageLocally = (chatId, message, sender) => {
    const storedChats = getChats(chatId);
    const updatedMessages = [
      ...storedChats,
      {
        sender: { username: sender },
        message,
        timestamp: new Date().toISOString(),
        id: storedChats.length + 1,
      },
    ];
    setMessages(updatedMessages);
    storeChats(chatId, updatedMessages);
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/localStorage/10`,
          { withCredentials: true }
        );
        res.data.data.forEach((chat) => {
          storeChats(chat._id, chat.messages);
        });
        setLocalData(res.data.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [loginUser]);

  useEffect(() => {
    const currentUser = Cookies.get('CurrentUser');
    if (currentUser) {
      try {
        const userObject = JSON.parse(currentUser);
        setLoginUser(userObject.username1 || 'Guest');
        setLoginUserImage(userObject.profilepic || '/default-avatar.png');
      } catch (error) {
        console.error('Error parsing CurrentUser cookie:', error);
      }
    }
  }, []);

  const handleSelectChat = (username, messages, chatId, chatterImg) => {
    setSelectedChat(username);
    const storedChats = getChats(chatId);
    setChats({
      username,
      messages: storedChats.length > 0 ? storedChats : messages,
      chatId,
      chatterImg: chatterImg || '/default-avatar.png',
    });
    if (!isActive) {
      socket.emit('user_active', { username: loginUser });
      setIsActive(true);
    }
    scrollToBottom();
  };

  const handleSend = async () => {
    if (message.trim() && selectedChat && chats?.chatId) {
      socket.emit('send_message', {
        friendUsername: selectedChat,
        message,
        timestamp: new Date().toISOString(),
        chatId: chats.chatId,
      });
      
      saveMessageLocally(chats.chatId, message, loginUser);
      setChats((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            sender: { username: loginUser },
            message,
            timestamp: new Date().toISOString(),
          },
        ],
      }));

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/saveChats`,
          {
            chatId: chats.chatId,
            receiver: selectedChat,
            message,
            timestamp: new Date().toISOString(),
          },
          { withCredentials: true }
        );
        setMessage('');
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  };

  const handleTyping = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    clearTimeout(debounceTimer.current);

    if (!amTyping) {
      setAmTyping(true);
      socket.emit('typing', { friendUsername: selectedChat });
    }

    debounceTimer.current = setTimeout(() => {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        if (amTyping) {
          setAmTyping(false);
          socket.emit('stop_typing', { friendUsername: selectedChat });
        }
      }, 1300);
    }, 200);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 0);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (data) => {
      if (data.sendername !== loginUser && data.chatId === chats?.chatId) {
        saveMessageLocally(data.chatId, data.message, data.sendername);
        setChats((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              sender: { username: data.sendername },
              message: data.message,
              timestamp: new Date().toISOString(),
            },
          ],
        }));
        scrollToBottom();
      } else if (data.sendername !== loginUser && data.chatId !== chats?.chatId) {
        saveMessageLocally(data.chatId, data.message, data.sendername);
      }
    });

    socket.on('typing', (data) => {
      if (data.sendername === selectedChat) setTyping(true);
    });

    socket.on('stop_typing', (data) => {
      if (data.sendername === selectedChat) setTyping(false);
    });

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('stop_typing');
    };
  }, [socket, selectedChat, chats, loginUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  const filteredChats = localData?.filter((chat) =>
    chat.participants.some((p) =>
      p?.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex h-screen bg-white">
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredChats?.map((chat) => (
            <ChatListItem
              key={chat._id}
              chat={chat}
              loginUser={loginUser}
              selectedChat={selectedChat}
              onSelect={handleSelectChat}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat && chats ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <img
                src={chats.chatterImg || '/default-avatar.png'}
                alt={chats.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-gray-900">{chats.username}</h2>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50" ref={chatContainerRef}>
              {chats.messages?.map((msg, index) => (
                <MessageBubble
                  key={index}
                  message={msg.message}
                  isCurrentUser={loginUser === msg.sender.username}
                  senderImage={
                    msg.sender.username !== loginUser ? chats.chatterImg : loginUserImage
                  }
                  timestamp={msg.timestamp}
                  username={msg.sender.username}
                />
              ))}
              {typing && (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-sm">{selectedChat} is typing...</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                  value={message}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">Welcome to Chat</h3>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp