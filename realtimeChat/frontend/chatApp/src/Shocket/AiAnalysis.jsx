import React, { useState } from 'react';
import axios from 'axios';

function AiAnalysis() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(false); 

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]); 

    const formData = new FormData();
    formData.append('imgToAnalysis', image);
    formData.append('prompt', prompt);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/aiImg`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data.data); 
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Upload Image & Prompt</h1>

        <label className="block">
          <span className="text-gray-700">Prompt</span>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
            rows="3"
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Enter your prompt here..."
            required
          ></textarea>
        </label>

        <label className="block">
          <span className="text-gray-700">Image</span>
          <input
            type="file"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </label>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Analysis Results:</h2>
          <ul className="space-y-2">
            {results.map((item, index) => (
              <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg">{item.key}:</h3>
                <p className="text-gray-700">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AiAnalysis;
