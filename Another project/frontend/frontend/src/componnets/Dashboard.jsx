import { useState } from 'react';

function Dashboard() {
  const [usrinfo, setusrinfo] = useState(null); // Initialize as null

  const fetchData = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/users/profile', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();
      setusrinfo(data.data); // Assuming the response has a data object containing user info
    } catch (er) {
      alert("Error while fetching data");
      console.log("Fetch error:", er); // Log the full error for better debugging
    }
  };

  return (
    <div className='relative mt-40'>
      <div className="max-w-sm w-full bg-white rounded-lg shadow-md overflow-hidden md:max-w-md mx-auto p-5">
        {usrinfo ? (
          <div className="flex items-center">
            <div className="h-24 w-24 flex justify-center items-center">
              <img
                src={usrinfo.ProfilePicture || 'https://via.placeholder.com/150'}
                alt="User profile"
                className="h-full w-full rounded-full border-2 border-gray-300 object-cover"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{usrinfo.username}</h2>
              <p className="text-gray-600">{usrinfo.email}</p>
              <p className="text-gray-500">{usrinfo.fullname}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-24">
            <p className="text-gray-500">No user information available.</p>
          </div>
        )}

        <div className='flex justify-center mt-5'>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white rounded-md px-2 py-0.5'
            onClick={fetchData}
          >
            Get your info
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
