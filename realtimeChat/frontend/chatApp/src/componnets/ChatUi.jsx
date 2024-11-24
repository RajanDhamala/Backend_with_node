import React from 'react';
import Message from '../componnets/Message';

function ChatUi() {
  const sampleMessage = {
    profileImage: 'https://imgs.search.brave.com/oT0gpIFMOHFGCkkbmRE9vczNQOhZl7SDDSX2ppZ027I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNy8x/MS8xOS8wNy8zMC9n/aXJsLTI5NjE5NTlf/NjQwLmpwZw',
    senderName: 'Bonnie Green',
    timestamp: '11:46',
    messageText:
      "That's awesome. I think our users will really appreciate the improvements.",
    status: 'Delivered',
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Message {...sampleMessage} />
    </div>
  );
}

export default ChatUi;
