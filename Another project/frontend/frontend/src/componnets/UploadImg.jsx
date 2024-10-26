import React, { useState } from 'react';

function UploadImg() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [username, setUsername] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !username) return alert("Please provide both a file and a username.");

    const formData = new FormData();
    formData.append("profileImage", selectedFile); // Ensure the key matches what multer expects
    formData.append("username", username);

    try {
      const response = await fetch("http://localhost:8000/users/uploadImg", {
        method: "POST",
        credentials: 'include',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert("Image uploaded successfully!");
      } else {
        alert(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
    }
  };

  return (
    <>
      <div className='relative mt-40 mx-5'>
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Enter username" 
            value={username} 
            onChange={handleUsernameChange} 
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div> 
        <button 
          onClick={handleUpload} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Upload Image
        </button>
      </div>
    </>
  );
}

export default UploadImg;
