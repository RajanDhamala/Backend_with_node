import React, { useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const fetchSearchResults = useCallback(
    debounce(async (query) => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data } = await axios.post(
          `http://localhost:8000/api/searchUser`,
          { search: query },
          { withCredentials: true }
        );

        if (data.statusCode === 200) {
          setSearchResults(data.data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Unable to fetch search results. Please try again.");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    fetchSearchResults(query);
  };

  const handleImageError = (e) => {
    e.target.src = "/default-avatar.png";
    e.target.onerror = null;
  };

  const handleProfileClick = async (username) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/getProfile/${username}`, {
        withCredentials: true,
      });

      if (data.statusCode === 200) {
        setUserProfile(data.data);
      } else {
        setError("User not found");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Unable to fetch profile. Please try again.");
    }
  };

  const handleSendMessageRequest = (receiverName) => {
    alert(receiverName);
    try {
      axios
        .post(`http://localhost:8000/api/sendRequest`, { receiverName }, { withCredentials: true })
        .then((response) => {
          console.log(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {isLoading && <div className="text-gray-500 text-sm mt-2">Loading...</div>}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <ul className="mt-4 border border-gray-200 rounded-lg">
        {searchResults.length > 0 ? (
          searchResults.map((user, index) => (
            <li
              key={index}
              className="p-2 border-b border-gray-100 last:border-none cursor-pointer transition hover:bg-gray-300"
              onClick={() => handleProfileClick(user.username)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={user.profilePic || "/default-avatar.png"}
                  alt={`${user.username}'s profile`}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={handleImageError}
                />
                <div className="flex flex-col">
                  <span>{user.username}</span>
                  <div className="flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        user.isActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                    <span className="text-sm text-gray-500">
                      {user.isActive ? "Active" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          !isLoading && <li className="p-2 text-gray-500 text-center">No results found</li>
        )}
      </ul>

      {userProfile && (
        <div className="mt-6 p-6 border-t border-gray-200 bg-white rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <img
              src={userProfile.profilePic || "/default-avatar.png"}
              alt={`${userProfile.username}'s profile`}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div>
              <h3 className="text-2xl font-semibold">{userProfile.username}</h3>
              <p className="text-sm text-gray-500">{userProfile.email}</p>
              <p className="text-sm text-gray-500">
                Birthdate: {new Date(userProfile.birthDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">Active Chats: {userProfile.activeChats}</p>
              <p className="text-sm text-gray-500">Friends: {userProfile.friends}</p>
              <div className="flex items-center mt-2">
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${
                    userProfile.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                <span className="text-sm text-gray-500">
                  {userProfile.isActive ? "Active" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => handleSendMessageRequest(userProfile.username)}
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Send Message Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchUser;
