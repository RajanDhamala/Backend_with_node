import React, { useState } from 'react';
import axios from 'axios';

const ChatWithAi = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle user message input
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Send message to backend
  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Message cannot be empty.');
      return;
    }

    // Clear previous errors and responses
    setError('');
    setResponse('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chatAi`, // Backend URL
        { message },  // Send message in request body
        {
          withCredentials: true,  // Send credentials (cookies)
        }
      );
      console.log(res);

      setResponse(res.data.aiResponse);  // Display AI's response
    } catch (err) {
      setError('Error occurred while chatting with AI. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Chat with AI</h1>
      <textarea
        value={message}
        onChange={handleMessageChange}
        placeholder="Enter your message"
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {response && <p><strong>AI Response:</strong> {response}</p>}
      </div>
    </div>
  );
};

export default ChatWithAi;
