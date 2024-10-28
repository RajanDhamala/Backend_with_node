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
    const [commentText, setCommentText] = useState('');
    const [openComments, setOpenComments] = useState({});

    useEffect(() => {
        const fetchAllTweets = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users/Gettweets', {
                    withCredentials: true,
                });
                setTweets(response.data.data.reverse());
            } catch (err) {
                setError(err.message);
                console.error(err);
            }
        };

        fetchAllTweets();
    }, []);

    const handleLike = async (tweetId) => {
        try {
            const response = await axios.post('http://localhost:8000/users/likeTweets', {
                tweetId,
            }, {
                withCredentials: true,
            });
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
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleCommentToggle = (tweetId) => {
        setOpenComments(prev => ({ ...prev, [tweetId]: !prev[tweetId] }));
    };

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleCommentSubmit = async (tweetId, commentText) => {
        try {
           
            console.log("Submitting comment:", { tweetId, comment: commentText });
    
            const response = await axios.post('http://localhost:8000/users/comment', {
                tweetId,
                comment: commentText,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
    
            const updatedComments = response.data.data; 

            setTweets(prevTweets =>
                prevTweets.map(tweet =>
                    tweet.tweetId === tweetId
                        ? { ...tweet, comments: updatedComments } 
                        : tweet
                )
            );
    

            setCommentText('');
        } catch (error) {
            console.error('Error submitting comment', error);
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
                                <img src="https://res.cloudinary.com/dvzx1oyy1/image/upload/v1730106699/profile_images/pgshzcuzbopr3zjhuw5h.jpg" alt={tweet.owner + " image"} className='h-full w-full object-cover object-center rounded-full'/>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-gray-500 opacity-80">{tweet.owner}</h3>
                                <p className='text-xs font-semibold opacity-70'>{timeAgo(tweet.uploadedAt)}</p>
                            </div>
                        </div>
                        <p className='text-md font-sans'>{tweet.caption}</p>
                        {tweet.contentURL && (
                            <img src={tweet.contentURL} alt="tweet content" className="mt-2 object-cover" />
                        )}
                        <div className="flex items-center space-x-4 my-2">
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => handleLike(tweet.tweetId)}
                                    className={`text-3xl transition transform duration-150 hover:scale-110 ${tweet.isLiked ? 'text-blue-500' : 'text-gray-500'}`}
                                >
                                    {tweet.isLiked ? '♥' : '♡'}
                                </button>
                                <p className="text-gray-600 text-sm">{tweet.likes} Likes</p>
                            </div>

                            <div className="flex items-center space-x-1">
                                <button 
                                    className="text-2xl transition transform duration-150 hover:scale-110" 
                                    onClick={() => handleCommentToggle(tweet.tweetId)}>
                                    💬
                                </button>
                                <p className="text-gray-600 text-sm">{(tweet.comments || []).length} Comments</p>
                            </div>
                        </div>

                        {openComments[tweet.tweetId] && (
                            <div className="comments-section mt-4">
                                <div className="flex flex-col space-y-2">
                                    {(tweet.comments || []).map((comment, index) => (
                                        <div key={index} className="comment flex items-center border-b py-2">
                                            <div className='overflow:hidden  h-8 w-8'>
                                                <img src="https://example.com/path/to/user/photo" alt={`${comment.username} profile`} className='h-full w-full object-cover object-center rounded-full'/>
                                            </div>
                                            <div className="ml-2">
                                                <p className="font-semibold">{comment.username || "User"}</p> {/* Adjust as necessary */}
                                                <p className="text-sm">{comment.comment}</p>
                                                <p className="text-xs text-gray-500">{timeAgo(comment.commentedAt)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 mt-2">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={handleCommentChange}
                                        className="focus:outline-none flex-grow px-1 rounded-md"
                                        placeholder="Write a comment..."
                                    />
                                    <button 
                                        className="text-blue-500 text-2xl ml-2 transform hover:scale-110"
                                        onClick={() => handleCommentSubmit(tweet.tweetId)}
                                    >
                                        ➤
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default GetTweets;
