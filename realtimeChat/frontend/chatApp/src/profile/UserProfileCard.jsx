import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import UpdateProfilePicture from "./UpdateProfilePicture";
import SettingsModal from "./SettingsModal";
import Alert from "../AiComps/Alert";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";


function UserProfileCard() {
  const navigate=useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toggleVisReq, setToggleVisReq] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendsListVisible, setFriendsListVisible] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [username, setUsername] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUpdatingProfilePic, setIsUpdatingProfilePic] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleFriendsList = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/friendsList/${username}`,
        { withCredentials: true }
      );
      setFriendsList(res.data.data);
      setFriendsListVisible(true);
      setAlert({ type: "success", title: "Success", message: "Friends list loaded successfully" });
    } catch (err) {
      console.error("Error fetching friends list:", err.response?.data || err.message);
      setAlert({ type: "error", title: "Error", message: "Failed to load friends list" });
    }
  };

  const handleAcceptReject = (username, action) => {
    console.log('Action:', action, 'Username:', username);
    axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/friend-request/${action}/${username}`,
      {},
      { withCredentials: true }
    )
      .then((response) => {
        console.log('Response:', response.data);
        setAlert({ type: "success", title: "Success", message: `Friend request ${action}ed successfully` });
        setFriendRequests(prevRequests => prevRequests.filter(req => req.Username !== username));
      })
      .catch((err) => {
        console.error('Error:', err.response?.data || err.message);
        setAlert({ type: "error", title: "Error", message: `Failed to ${action} friend request` });
      });
  };

  const callRequestApi = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/requestList`, { withCredentials: true })
      .then((response) => {
        const data = (response.data.data.friendRequests);
        setFriendRequests(data);
        console.log(data);
        setToggleVisReq(true);
        setAlert({ type: "success", title: "Success", message: "Friend requests loaded successfully" });
      }).catch((err) => {
        console.log(err, "while fetching requests");
        setAlert({ type: "error", title: "Error", message: "Failed to load friend requests" });
      });
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/UserProfile`, { withCredentials: true })
      .then((response) => {
        setUserData(response.data.data);
        console.log(response.data.data);
        setLoading(false);
        setUsername(response.data.data.username);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
        setAlert({ type: "error", title: "Error", message: "Failed to load user profile" });
      });
  }, []);

  if (loading)
    return (
      <div role="status" className="animate-pulse p-6 mt-10">
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
        <div className="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 max-w-[540px]"></div>
        <div className="flex items-center justify-center mt-4">
          <svg
            className="w-8 h-8 text-gray-200 dark:text-gray-700 me-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
          <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3"></div>
          <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );

  if (error) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 bg-gray-100 min-h-screen"
    >
      <AnimatePresence>
        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
            autoClose={true}
            duration={5000}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden mx-auto"
      >
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <motion.div
            className="absolute -bottom-16 left-8"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={userData?.profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <motion.div
              className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsUpdatingProfilePic(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        <div className="pt-20 pb-6 px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{userData?.username}</h1>
              <p className="text-gray-600 mt-1">{userData?.email}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <motion.button
                className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSettingsOpen(true)}
              >
                Settings
              </motion.button>
              <Link to={'/ChatApp'}>
              <motion.button
                className="px-4 py-2 bg-purple-500 text-white rounded-full shadow-md hover:bg-purple-600 transition duration-300 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Messages
              </motion.button>
              </Link>
              
            </div>
          </div>
          <p className="text-gray-500 mt-4">{userData?.bio || "No biography available."}</p>
        </div>

        <div className="flex justify-between items-center py-4 px-8 bg-gray-50 border-t border-gray-200">
          <motion.div
            className="text-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={(e) => handleFriendsList(e)}
          >
            <p className="text-2xl font-bold text-gray-800">{userData?.friends || 0}</p>
            <p className="text-gray-600 text-sm">Friends</p>
          </motion.div>
          <motion.div
            className="text-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={(e) => callRequestApi(e)}
          >
            <p className="text-2xl font-bold text-gray-800">{userData?.friendRequests || 0}</p>
            <p className="text-gray-600 text-sm">Requests</p>
          </motion.div>
          <motion.div
            className="text-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
          >
            <p className="text-2xl font-bold text-gray-800">{userData?.activeChats || 0}</p>
            <p className="text-gray-600 text-sm">Active Chats</p>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {toggleVisReq && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md mx-auto"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-center">Friend Requests</h2>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {friendRequests.map((request, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <img
                        src={request.ProfilePic}
                        alt={request.Username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <p className="ml-3 font-medium">{request.Username}</p>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
                        onClick={() => handleAcceptReject(request.Username, "accept")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Accept
                      </motion.button>
                      <motion.button
                        className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                        onClick={() => handleAcceptReject(request.Username, "reject")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Reject
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                className="mt-6 px-4 py-2 w-full bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                onClick={() => setToggleVisReq(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {friendsListVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md mx-auto"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-center">Friends List</h2>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {friendsList.map((friend, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm border-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <img
                        src={friend.profilePic}
                        alt={friend.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <p className="ml-3 font-medium">{friend.username}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        friend.isActive ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                      }`}
                    >
                      {friend.isActive ? "Online" : "Offline"}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.button
                className="mt-6 px-4 py-2 w-full bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                onClick={() => setFriendsListVisible(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {isUpdatingProfilePic && (
          <UpdateProfilePicture
            onClose={() => setIsUpdatingProfilePic(false)}
            onUpdate={(newProfilePic) => {
              setUserData({ ...userData, profilePic: newProfilePic });
              setIsUpdatingProfilePic(false);
              setAlert({ type: "success", title: "Success", message: "Profile picture updated successfully" });
            }}
          />
        )}

        {isSettingsOpen && (
          <SettingsModal
            onClose={() => setIsSettingsOpen(false)}
            onUpdate={(updatedData) => {
              setUserData({ ...userData, ...updatedData });
              setIsSettingsOpen(false);
              setAlert({ type: "success", title: "Success", message: "Settings updated successfully" });
            }}
            currentUsername={userData.username}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default UserProfileCard;

