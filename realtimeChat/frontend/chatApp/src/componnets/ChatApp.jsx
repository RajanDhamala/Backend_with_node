import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import moment from 'moment';
import Cookies from 'js-cookie';


const socket = io('http://localhost:8000', {
  withCredentials: true,
});

function ChatApp() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [Amityping, setAmiTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const [LoginUser, setLoginUser] = useState(null);
  const [LoginUserImage, setLoginUserImage] = useState(null);
  const [isActive, setIsActive] = useState(false); 
  const [typing, setTyping] = useState(false);
  const [localdata,setLocaldata]=useState(null);
  let typingTimeout = useRef(null);
  let debounceTimer = useRef(null);
  let fetchTimeout = useRef(null);
  const [chats, setChats] = useState([]);


  const storeChatsInSessionStorage = (chats) => {
    try {
      sessionStorage.setItem('chats', JSON.stringify(chats));  
      console.log('Chats stored in session storage:', JSON.parse(sessionStorage.getItem('chats')));
    } catch (error) {
      console.error('Error storing chats in session storage:', error);
    }
  };
  
  const getChatsFromSessionStorage = () => {
    try {
      const chats = JSON.parse(sessionStorage.getItem('chats')); 
      if (!chats || !Array.isArray(chats)) {
        console.log('No chats found in session storage.');
        return [];
      }
      return chats;
    } catch (error) {
      console.error('Error retrieving chats from session storage:', error);
      return [];
    }
  };

  const saveMessageLocally=(receiver,message,sender)=>{
    console.log(chats)
    chats.map((chat)=>{
      chat.participants.map((participant)=>{
        if(participant.username === receiver){
          chat.messages.push({
            message:message,
            timestamp:new Date().toISOString(),
            sender:{'username':sender}
          })}
      })
    })
  }

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/localStorage/10', {
          withCredentials: true,
        });
        const response = res.data;
        console.log('Response:', response.data);
        storeChatsInSessionStorage(response.data);
        setLocaldata(response.data); 
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
    const data=getChatsFromSessionStorage()
    data.map((chat)=>{
      console.log(chat)
      chat.messages.map((msg)=>{
        console.log(msg)
      })
    })
    console.log(localdata)
  }, []);

  const handleActiveStatus = () => {
    if (!isActive) {
      socket.emit('user_active', { username: LoginUser });
      setIsActive(true);
    }
  };

  useEffect(() => {
    const currentUser = Cookies.get('CurrentUser');
    if (currentUser) {
      try {
        const userObject = JSON.parse(currentUser);
        setLoginUser(userObject.username1);
        setLoginUserImage(userObject.profilepic);
      } catch (error) {
        console.error('Error parsing CurrentUser cookie:', error);
      }
    }
  }, []);


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

 

  const handleSelectChat = (username,messages,chatid,chatterImg) => {
    setSelectedChat(username);
    console.log(messages,chatid,chatterImg,username)
    setChats({
      'username':username,
      'messages':messages,
      'chatid':chatid,
      'chatterImg':chatterImg
    })
    handleActiveStatus();
  };

  const sendMessage = async () => {
    if (message.trim() && selectedChat) {
      socket.emit('send_message', { friendUsername: selectedChat, message, timestamp: new Date().toISOString() });

      saveMessageLocally(selectedChat,message,LoginUser)

      try {
        console.log('Saving message to database...');
        const response = await axios.post('http://localhost:8000/api/saveChats', {
          receiver: selectedChat,
          message,
          timestamp: new Date().toISOString(),
        }, { withCredentials: true });
        setMessage('');

        if (response.data.statusCode === 200) {
          console.log('Message saved to database');
        } else {
          console.error('Failed to save message to database');
        }
      } catch (error) {
        console.error('Error saving message to database:', error);
      }
    } else {
      console.error('Message or selected chat is missing');
    }
  };

  const handleTyping = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
  
    clearTimeout(debounceTimer.current);
  
   
    if (!Amityping) {
      setAmiTyping(true); 
      socket.emit('typing', { friendUsername: selectedChat });
    }
  
    debounceTimer.current = setTimeout(() => {
      clearTimeout(typingTimeout.current);
  
      typingTimeout.current = setTimeout(() => {
        if (Amityping) {
          setAmiTyping(false);
          socket.emit('stop_typing', { friendUsername: selectedChat });
        }
      }, 1300);
    }, 200);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    socket.on('message', (data) => {
      if (data.sendername === selectedChat) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: { username: data.sendername },
            message: data.message,
            timestamp: data.timestamp,
          },
        ]);
      }
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
  {(localdata || []).map((chat, index) => {
    const otherParticipant = chat.participants.find(
      (participant) => participant.username !== LoginUser
    );
    const isSelected = selectedChat === otherParticipant?.username;
    const latestMessage = chat.messages.length > 0 
      ? chat.messages[chat.messages.length - 1].message 
      : 'prev chat view';

    return (
      <li
        key={chat._id}
        className={`p-4 cursor-pointer hover:bg-gray-200 ${isSelected ? 'bg-blue-100' : ''}`}
        onClick={() => handleSelectChat(otherParticipant?.username,chat.messages,chat._id,otherParticipant?.profilePic)}
      >
        <div className="flex items-center gap-4">
          <img
            src={otherParticipant?.profilePic || '/default-avatar.png'}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-bold">{otherParticipant?.username}</div>
            <div className="text-sm text-gray-500">{latestMessage || 'prev chat view'}</div>
          </div>
        </div>
      </li>
    );
  })}
</ul>

      </div>   
      <div className="w-2/3 flex flex-col">
        <div className="p-4 border-b bg-white flex items-center">
          {selectedChat && chats ? (
            <div>
              <h2 className="text-lg font-bold">{chats.username}</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          ) : (
            <h2 className="text-lg font-bold">Select a chat</h2>
          )}
        </div>


        <div className="flex-grow p-4 overflow-y-auto bg-gray-50" ref={chatContainerRef}>
          {chats ? (
            <>
          {(chats.messages || []).map((msg, index) => (
        <div
        className={`chat ${LoginUser === msg.sender.username ? 'chat-end' : 'chat-start'}`}
        key={msg._id}
      >
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
           <img
             alt={msg.sender.username}
             src={
             msg.sender.username !== LoginUser
                ? chats.chatterImg
                : LoginUserImage
            }
          />
        </div>
      </div>
         <div className="chat-header">
        {msg.sender.username}
         <time className="text-xs opacity-50 ml-2">{moment(msg.timestamp).format('hh:mm A')}</time>
      </div>
      <div
      id={msg._id}
      className={`chat-bubble text-white ${
        LoginUser === msg.sender.username ? 'bg-blue-500' : 'bg-green-500'
          }`}
       >
          {msg.message}
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
