import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoGallery = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users/videoPost', {
          withCredentials: true,
        });

        if (response.data && response.data.data) {
          setData(response.data.data);
        } else {
          setError('No data found');
        }
      } catch (err) {
        console.error('Error fetching video/photo data:', err);
        setError('Error fetching video/photo data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-6">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        {data.username}'s Videos & Photos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.media && data.media.length > 0 ? (
          data.media.map((item, index) => (
            <div
              key={index}
              className="media-item bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {item.type === 'video' ? (
                <div className="aspect-w-16 aspect-h-9">
                  <video controls className="w-full h-full object-cover">
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <img src={item.url} alt={`Media ${index}`} className="w-full h-full object-cover" />
              )}
              <div className="p-4">
                <p className="text-gray-700 text-sm">Uploaded At: {new Date(item.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <div>No media available</div>
        )}
      </div>
    </div>
  );
};

export default VideoGallery;
