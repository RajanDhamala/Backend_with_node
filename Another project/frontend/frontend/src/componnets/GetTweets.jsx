import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetTweets = () => {

    const timeAgo = (timestamp) => {
        const now = new Date();
        const postTime = new Date(timestamp);
        const secondsAgo = Math.floor((now - postTime) / 1000);
    
        if (secondsAgo < 60) {
            return `${secondsAgo} seconds ago`;
        } else if (secondsAgo < 3600) {
            const minutesAgo = Math.floor(secondsAgo / 60);
            return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
        } else if (secondsAgo < 86400) {
            const hoursAgo = Math.floor(secondsAgo / 3600);
            return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
        } else {
            const daysAgo = Math.floor(secondsAgo / 86400);
            return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
        }
    };

    const [tweets, setTweets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users/Gettweets', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                console.log(response.data);
                setTweets(response.data.data.reverse());
            } catch (err) {
                setError('Error fetching tweets');
                console.error(err);
            }
        };

        fetchTweets();
    }, []);

    const handleLike = async (tweetId, isLiked) => {
        try {
            const response = await axios.post('http://localhost:8000/users/likeTweets', {
                tweetId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

           
            if (response.data && response.data.data) {
                const { likeCount, liked } = response.data.data;

              
                const updatedTweets = tweets.map(tweet => {
                    if (tweet.tweetId === tweetId) {
                        return {
                            ...tweet,
                            likes: likeCount, 
                            isLiked: liked,   
                        };
                    }
                    return tweet;
                });
                setTweets(updatedTweets);
            }
        } catch (err) {
            console.error('Error liking the tweet', err);
        }
    };

    return (
        <div className="tweets-list mx-7">
            {error && <p className="text-red-500">{error}</p>}
            {tweets.length === 0 ? (
                <p>No tweets available</p>
            ) : (
                tweets.map(tweet => (
                    <div key={tweet.tweetId} className="tweet border p-4 mb-4 rounded bg-gray-200">
                        <div className='flex items-center gap-x-1'>
                        <div className='overflow:hidden  h-10 w-10'>
                            <img src="https://res.cloudinary.com/dvzx1oyy1/image/upload/v1730106699/profile_images/pgshzcuzbopr3zjhuw5h.jpg" alt={tweet.owner+" image"} className='h-full w-full object-cover object-center rounded-full'/>
                        </div>
                        <div>
                        <h3 className="font-semibold text-sm text-gray-500 opacity-80">{tweet.owner}</h3>
                        <p className='text-xs font-semibold opacity-70'>2 hours ago</p>
                
                        </div>
                        </div>      
                        <p className='text-md font-sans '>{tweet.caption}</p>
                        {tweet.contentURL && (
                            <img src={tweet.contentURL} alt="tweet content" className="mt-2 object-cover" />
                        )}
                    <div className="flex items-center space-x-4 my-2">
    <div className="flex items-center space-x-1">
        <button
            onClick={() => handleLike(tweet.tweetId, tweet.isLiked)}
            className={`text-3xl transition transform duration-150 hover:scale-110 ${
                tweet.isLiked ? 'text-blue-500' : 'text-gray-500'
            }`}
        >
            {tweet.isLiked ? '♥' : '♡'}
        </button>
        <p className="text-gray-600 text-sm">{tweet.likes} Likes</p>
    </div>

    <div className="flex items-center space-x-1">
        <button className="text-2xl transition transform duration-150 hover:scale-110">
            💬
        </button>
        <p className="text-gray-600 text-sm">{tweet.comments} Comments</p>
    </div>
</div>

                    </div>
                ))
            )}
        </div>
    );
};
    
export default GetTweets;
