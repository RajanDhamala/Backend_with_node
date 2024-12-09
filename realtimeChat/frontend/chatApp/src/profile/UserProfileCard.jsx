import React, { useState, useEffect } from "react";
import axios from "axios";
import { set } from "lodash";
import { use } from "react";

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toggleVisReq, settoggleVisReq] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
const [message,setMessage]=useState('');


const handelAcceptReject = (username, action) => {
  console.log('Action:', action, 'Username:', username); // Debug logs
  axios.post(
      `http://localhost:8000/api/friend-request/${action}/${username}`,
      {}, // Empty body
      { withCredentials: true } // Pass credentials
  )
  .then((response) => {
      console.log('Response:', response.data); // Success
  })
  .catch((err) => {
      console.error('Error:', err.response?.data || err.message); // Errors
  });
};


  const callRequestApi=()=>{
    axios.get("http://localhost:8000/api/requestList", { withCredentials: true })
    .then((response)=>{
      const data=(response.data.data.friendRequests);
      setFriendRequests(data)
      console.log(data);
      settoggleVisReq(true);
    }).catch((err)=>{
      console.log(err,"while fething requests");
    })
  }

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/UserProfile", { withCredentials: true })
      .then((response) => {
        setUserData(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  },['']);

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
    <div className="p-8 bg-gray-200">
      <div className="p-7 shadow mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-3 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">{userData?.friends || 0}</p>
              <p className="text-gray-400 cursor-pointer hover:scale-105 ">Friends</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">{userData?.friendRequests || 0}</p>
              <p onClick={(e)=>callRequestApi(e)} className="text-gray-400 cursor-pointer hover:scale-105 ">Message Requests</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">{userData?.activeChats}</p>
              <p className="text-gray-400 cursor-pointer hover:scale-105 ">Active chats</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              <img
                src={userData?.profilePic || "https://via.placeholder.com/150"}
                alt="Profile"
                className="h-48 w-48 rounded-full object-cover"
              />
            </div>
          </div>
          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <button className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Settings
            </button>
            <button className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Messages
            </button>

            {toggleVisReq && (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 p-4 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl">
    <h2 className="text-lg font-bold mb-4 text-center">Friend Requests</h2>
    <div className="space-y-4 max-h-80 overflow-y-auto">
      {friendRequests.map((request, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
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
            <button
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() =>handelAcceptReject(request.Username,"accept")}
            >
              Accept
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handelAcceptReject(request.Username,"reject")}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
    <button
      className="mt-4 px-4 py-2 w-full bg-gray-700 text-white rounded hover:bg-gray-800"
      onClick={() => settoggleVisReq(false)}
    >
      Close
    </button>
  </div>
)}

          </div>
        </div>
        <div className="mt-20 text-center border-b pb-5">
          <h1 className="text-4xl font-medium text-gray-700">
            {userData?.username}
          </h1>
          <p className="font-light text-gray-600 mt-3">{userData?.email}</p>
        </div>
        <div className="mt-3 flex flex-col justify-center">
          <p className="text-gray-600 text-center font-light lg:px-16">
            {userData?.bio || "No biography available."}
          </p>
          <button className="text-indigo-500 py-2 px-4 font-medium mt-4">
            Show more
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
