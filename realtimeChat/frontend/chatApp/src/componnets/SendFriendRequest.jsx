import React, { useState } from "react";
import axios from "axios";


const SendFriendRequest = () => {
  const [receiverName, setReceiverName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]); e
  };


  const handleFriendRequest = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/sendRequest`, 
        { receiverName },
        {
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };
  const handleProfilePicUpload = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!profilePicture) {
      setError("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("ProfilePic", profilePicture);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/setPfp`, 
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Actions</h2>
      <form onSubmit={handleFriendRequest} className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Send Friend Request</h3>
        <div className="mb-4">
          <label
            htmlFor="receiverName"
            className="block text-sm font-medium text-gray-700"
          >
            Receiver Username
          </label>
          <input
            type="text"
            id="receiverName"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Send Request
        </button>
      </form>

      <form onSubmit={handleProfilePicUpload}>
        <h3 className="text-xl font-semibold mb-4">Upload Profile Picture</h3>
        <div className="mb-4">
          <label
            htmlFor="profilePicture"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            onChange={handleFileChange}
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:bg-gray-100 file:cursor-pointer focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Upload Profile Picture
        </button>
      </form>

      {message && (
        <p className="mt-4 text-green-600 text-sm text-center">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
      )}


    </div>
  );
};

export default SendFriendRequest;
