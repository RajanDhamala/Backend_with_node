import React, { useState } from 'react';

const otpRequest = ({ onRequestSuccess }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleRequestOTP = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/users/sendOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('OTP sent successfully!');
                onRequestSuccess(email); 
            } else {
                setMessage(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setMessage('An error occurred while sending OTP');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 mt-10 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Request OTP</h2>
            <form onSubmit={handleRequestOTP} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Request OTP
                </button>
            </form>
            {message && <p className="text-center mt-2 text-red-500">{message}</p>}
        </div>
    );
};

export default otpRequest;
