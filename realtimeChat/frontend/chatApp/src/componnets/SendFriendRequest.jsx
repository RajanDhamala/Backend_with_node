import React, { useState } from 'react';
import axios from 'axios';

const SendFriendRequest = () => {
  const [receiverName, setReceiverName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/sendRequest', 
        { receiverName },
        {
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Send Friend Request</h2>
      <form onSubmit={handleSubmit}>
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
