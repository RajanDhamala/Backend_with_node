import React, { useState, useRef } from 'react';
import axios from 'axios';

function DoTwitterPost() {
  const caption = useRef(null);
  const media = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleTwitterPost = async (e) => {
    e.preventDefault();

    if (!caption.current.value || !media.current.files[0]) {
      setError('Please fill all the fields');
      return; 
    }

    setLoading(true); 
    setError(null); 
    setSuccess(null); 

    try {
      const formData = new FormData();
      formData.append('caption', caption.current.value); 
      formData.append('content', media.current.files[0]); 

      const response = await axios.post('http://localhost:8000/users/postTweets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }).then((res)=>res.data);

      console.log(response);
      setSuccess('Post uploaded successfully');
    } catch (error) {
      setError('Something went wrong while connecting to backend');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Media</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>} 
          {success && <p className="text-green-500 mb-4">{success}</p>} 

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Caption</label>
            <input
              ref={caption}
              type="text"
              placeholder="Enter caption..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Upload Video/Photo</label>
            <input
              ref={media}
              type="file"
              accept="image/*,video/*"
              className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
            />
          </div>

          <div className="text-center">
            <button
              className={`bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleTwitterPost}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoTwitterPost;
