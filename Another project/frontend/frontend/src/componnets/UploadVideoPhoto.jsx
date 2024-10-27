import React, { useState } from 'react';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('videoPhoto', selectedFile);
    
    setUploading(true); // Start uploading

    try {
      const response = await fetch('http://localhost:8000/users/uploadVideoPhoto', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response from server:', data);
      setMessage('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setMessage('Error uploading file. Please try again.');
    } finally {
      setUploading(false); // Reset uploading state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-center text-gray-700">Upload Photo/Video</h2>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="block w-full px-4 py-2 mb-4 text-gray-700 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        {selectedFile && (
          <p className="mb-4 text-gray-500">Selected File: {selectedFile.name}</p>
        )}
        <button
          onClick={handleUpload}
          className={`w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {message && (
          <p className="mt-4 text-center text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
