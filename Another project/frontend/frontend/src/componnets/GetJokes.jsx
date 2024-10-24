import React, { useState } from 'react';

function GetJokes() {
    const [jokes, setJokes] = useState(null); // Initialize as null

    const handelfetch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/users/jokes");
            const data = await response.json();
            console.log(data);
            setJokes(data.data); // Set the joke
        } catch (error) {
            alert(`Something went wrong: ${error}`);
        }
    };

    return (
        <>
            <div className='flex justify-center flex-col'>
                <div className='gap-3 mt-5 text-2xl font-semibold flex flex-col items-center'>
                    <h1>Click here to get Get jokes</h1>
                    <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={(e) => handelfetch(e)}
                    >
                        Get jokes
                    </button>
                </div>

                {jokes ? (
                    <div className='flex justify-center mt-5'>
                        <a
                            href="#"
                            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                        >
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{jokes}</h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">{jokes}</p>
                        </a>
                    </div>
                ) : (
                    <h1 className='text-center font-semibold text-3xl text-red-500'>Jokes are being cooked ...</h1>
                )}
            </div>
        </>
    );
}

export default GetJokes;
