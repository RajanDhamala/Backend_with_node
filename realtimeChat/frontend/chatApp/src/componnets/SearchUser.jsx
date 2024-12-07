import React, { useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
            >
              <div className="flex items-center space-x-4">
                <img
                  src={user.profilePic || "/default-avatar.png"}
                  alt={`${user.username}'s profile`}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={handleImageError}
                />
                <span>{user.username}</span>
              </div>
            </li>
          ))
        ) : (
          !isLoading && (
            <li className="p-2 text-gray-500 text-center">No results found</li>
          )
        )}
      </ul>
    </div>
  );
};

export default SearchUser;
