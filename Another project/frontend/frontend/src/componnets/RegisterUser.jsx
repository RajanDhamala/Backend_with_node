import React, { useRef, useState } from 'react';

function RegisterUser() {
  const [message, setMessage] = useState(''); 
  const [isSuccess, setIsSuccess] = useState(null); 
  const username = useRef('');
  const password = useRef('');
  const email = useRef('');
  const fullname = useRef('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        username: username.current.value,
        password: password.current.value,
        email: email.current.value,
        fullname: fullname.current.value,
    };

    try {
        const response = await fetch('http://localhost:8000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const res = await response.json();

        // Check response status and message
        if (response.status === 201 && res.message === "Success") {
            setMessage(`Registration successful! Welcome, ${res.data.username}`);
            setIsSuccess(true); // success
        } else {
            setMessage(res.message || 'Failed to register. Please try again.');
            setIsSuccess(false); // failure
        }

        // Optional: Clear the input fields after submission
        username.current.value = '';
        password.current.value = '';
        email.current.value = '';
        fullname.current.value = '';

    } catch (error) {
        console.error('Error:', error);
        setMessage('Failed to register due to a network issue.');
        setIsSuccess(false); // failure in case of network error
    }
};
  return (
    <>
      <div className="top-20 relative">
        <h1 className="text-center text-3xl font-semibold mb-3 text-red-500">Register User Now</h1>

        {/* Form */}
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name (optional)</label>
            <input
              ref={fullname}
              type="text"
              id="fullname"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
            <input
              ref={username}
              type="text"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your username"
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input
              ref={email}
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@flowbite.com"
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input
              ref={password}
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder='Password'
              required
            />
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Submit
          </button>
        </form>

        {/* Success or failure message */}
        {message && (
          <div className={`mt-5 p-4 rounded-lg text-center text-white ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}>
            {message}
          </div>
        )}
      </div>
    </>
  );
}

export default RegisterUser;
