import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, UserPlus, Search, Mail, Calendar, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import axios from "axios";
import Alert from "../AiComps/Alert"
import { data } from "autoprefixer";

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [alertProps, setAlertProps] = useState(null);

  const showAlert = (type, title, message) => {
    setAlertProps({ type, title, message });
    setTimeout(() => setAlertProps(null), 4000);
  };

  const fetchSearchResults = useCallback(
    debounce(async (query) => {
      if (!query) {
        setSearchResults([]);
        return;
      }
      setIsLoading(true);

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/searchUser`,
          { search: query },
          { withCredentials: true }
        );

        console.log("Search results:", data.data); 
        if (data.statusCode === 200) {
          setSearchResults(data.data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
        showAlert('error',"Error","Error fetching search results:")
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleProfileClick = async (username) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/getProfile/${username}`,
        { withCredentials: true }
      );
      console.log("User profile data:", data.data);
      if (data.statusCode === 200) {
        setUserProfile(data.data);
        showAlert("success","Success",'fetched the user data')
      }if(data.statusCode===201){
        showAlert('warning','Warning',data.message || 'thats who u are')
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      showAlert('error',"Error","Error fetching profile:")
      setUserProfile(null);
    }
  };

  const handleSendMessageRequest = async (receiverName) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/sendRequest`,
        { receiverName },
        { withCredentials: true }
      );
      showAlert('success','Success',data.message || "Failed to send message request")
    } catch (error) {
      console.error("Error sending message request:", error);
      showAlert("error","Error","Unable to send message request")
    }
  };

  const handleStartChat = async (receiver) => {
    const initialMessage = encodeURIComponent("Welcome to the chat app!");
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/${receiver}/${initialMessage}`,
        { withCredentials: true }
      );
      {
        data.statusCode === 201 ?  showAlert('success','Success',data.message || "intilized the chat database"):
        showAlert('error','Error',data.message || "chat already exist" )
      }
    
    } catch (error) {
      showAlert('error','error',data.message || 'error while creating chat')
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 bg-gradient-to-br from-blue-950 to-blue-900"
    >
        {alertProps && (
        <Alert
          type={alertProps.type}
          title={alertProps.title}
          message={alertProps.message}
          onClose={() => setAlertProps(null)}
        />
      )}
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="relative overflow-hidden bg-blue-950/50 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
              <Input
                className="pl-10 bg-blue-900/30 border-blue-500/30 text-white placeholder:text-blue-400/70"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  fetchSearchResults(e.target.value);
                }}
              />
            </div>

            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center py-4"
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
                </motion.div>
              )}

              <motion.div layout className="space-y-2 mt-4">
                {searchResults.map((user) => (
                  <motion.div
                    key={user._id || user.username}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-lg bg-blue-900/30 hover:bg-blue-800/30 cursor-pointer border border-blue-500/20"
                    onClick={() => handleProfileClick(user.username)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.profilePic || "/default-profile.png"} />
                        <AvatarFallback className="bg-blue-700 text-white">
                          {user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-white">{user.username}</p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${user.isActive ? "bg-green-400" : "bg-gray-400"}`}
                          />
                          <span className="text-sm text-blue-300">
                            {user.isActive ? "Active" : "Offline"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <AnimatePresence>
          {userProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-blue-950/50 border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={userProfile.profilePic || "/default-profile.png"} />
                      <AvatarFallback className="bg-blue-700 text-white">
                        {userProfile.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{userProfile.username}</h3>
                        <div className="flex items-center gap-2 text-blue-300">
                          <Mail className="w-4 h-4" />
                          <span>{userProfile.email}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(userProfile.birthDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>Active Chats: {userProfile.activeChats}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Friends: {userProfile.friends}</span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleSendMessageRequest(userProfile.username)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Send Request
                        </Button>
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          variant="secondary"
                          onClick={() => handleStartChat(userProfile.username)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Start Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchUser;
