import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/UserProfile`, { withCredentials: true })
      .then((response) => {
        setUserData(response.data.data); 
        console.log(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch user profile.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-md shadow-md w-full sm:w-96 mx-auto mt-10">
      <img
        src={userData.profilePic || 'https://imgs.search.brave.com/tPhlQn0IEkIi19BiAi9DTderoYUjR5d4DP9bHp3QEow/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/aXNhcHBvaW50ZWQt/eW91bmctYmxvbmRl/LXNsYXZpYy13b21h/bi1sb29raW5nLXNp/ZGVfMTQxNzkzLTEy/NDMxMS5qcGc_c2Vt/dD1haXNfaHlicmlk'}
        alt="Profile"
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mb-4"
      />
      <h1 className="text-xl sm:text-2xl font-semibold mb-2 text-center">{userData.username}</h1>
      <p className="text-gray-700 mb-1 text-center">
        <strong>Email:</strong> {userData.email}
      </p>
      <p className="text-gray-700 text-center">
      <strong>Birthdate:</strong> {new Date(userData.dob).toLocaleDateString('en-GB')}
      </p>
    </div>
  );
}

export default UserProfile;
