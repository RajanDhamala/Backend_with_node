import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  export const uploadImage = async (filePath, folder) => {
    try {
      const result = await cloudinary.v2.uploader.upload(filePath, {
        folder: folder || 'uploads'
      });
      return result.secure_url;
    } catch (error) {
      throw new Error('Cloudinary upload failed');
    }
  };

