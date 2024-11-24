import React, { useState } from "react";
import axios from "axios";

const UserRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);

  const submitForm = () => {
    setLoading(true);
    setMessage("");
    axios
      .post("http://localhost:8000/api/register", {
        username: username,
        password: password,
        email: email,
        birthDate: dob,
      })
      .then((res) => {
        setLoading(false);
        setMessage(res.data.message);
      })
      .catch((err) => {
        setLoading(false);
        setMessage("An error occurred during registration.");
        console.error(err);
      });
  };

  return (
    <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4 bg-gray-300">
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8 bg-white">
        <div className="text-center mb-3">
          <a href="">
            <img
              src="https://imgs.search.brave.com/E8bwxfJO_KMM8GuJK6d0UXjoA-D_4eNRTYN-fP3q92I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/d2hhdHMtdGhlLWZv/bnQtdXNlZC1pbi10/aGUtbG9nby12MC14/ZHJzMWZzZDA5Y2Ex/LnBuZz9hdXRvPXdl/YnAmcz04MmViZDU4/NDhlNmNlMTk3ZDg0/MmFlNDI1MzRmNmM0/NDk3MDM2MjAz"
              alt="logo"
              className="h-12 inline-block"
            />
          </a>
        </div>

      

        <form>
          <div className="space-y-6">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Username</label>
              <input
                required
                name="username"
                type="text"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Email Id</label>
              <input
                required
                name="email"
                type="text"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Password</label>
              <input
                required
                name="password"
                type="password"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Date of Birth</label>
              <input
                required
                name="date"
                type="date"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter Dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <input
                required
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="text-gray-800 ml-3 block text-sm"
              >
                I accept the{" "}
                <a className="text-blue-600 font-semibold hover:underline ml-1">
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>

          <div className="!mt-12">
            <button
              type="button"
              className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              onClick={submitForm}
            >
              Create an account
            </button>
            {loading && (
          <div className="flex justify-center items-center mb-4">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-500 h-6 w-6"></div>
            <span className="ml-3 text-sm text-gray-600">Processing...</span>
          </div>
        )}

        {message && (
          <div
            className={`text-sm p-3 mb-4 rounded-md ${
              message.toLowerCase().includes("error")
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </div>
        )}
          </div>
          <p className="text-gray-800 text-sm mt-6 text-center">
            Already have an account?{" "}
            <a className="text-blue-600 font-semibold hover:underline ml-1">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;
