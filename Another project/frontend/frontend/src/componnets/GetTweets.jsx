import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetTweets = () => {
    const [tweets, setTweets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users/Gettweets', {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });
                console.log(response.data);
                setTweets(response.data.data);
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

            // Update the tweets state based on the response
            const updatedTweets = tweets.map(tweet => {
                if (tweet.tweetId === tweetId) {
                    // Toggle the liked status and update the like count
                    return {
                        ...tweet,
                        likes: isLiked ? tweet.likes - 1 : tweet.likes + 1,
                        isLiked: !isLiked,
                    };
                }
                return tweet;
            });
            setTweets(updatedTweets);
        } catch (err) {
            console.error('Error liking the tweet', err);
        }
    };

    return (
        <div className="tweets-list">
            {error && <p className="text-red-500">{error}</p>}
            {tweets.length === 0 ? (
                <p>No tweets available</p>
            ) : (
                tweets.map(tweet => (
                    <div key={tweet.tweetId} className="tweet border p-4 mb-4 rounded">
                        <h3 className="font-bold">{tweet.owner}</h3>
                        <p>{tweet.caption}</p>
                        {tweet.media && (
                            <img src={tweet.media} alt="tweet content" className="mt-2" />
                        )}
                        <p className="text-gray-600">{tweet.likes} Likes</p>
                        <p className="text-gray-500">{tweet.isLiked ? "You liked this tweet" : "You haven't liked this tweet"}</p>
                        <button
                            onClick={() => handleLike(tweet.tweetId, tweet.isLiked)}
                            className={`mt-2 px-4 py-2 rounded ${
                                tweet.isLiked ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                            }`}
                        >
                            {tweet.isLiked ? 'Unlike' : 'Like'}
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default GetTweets;
