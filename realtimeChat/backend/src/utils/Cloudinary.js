import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (filePath, folder, isVideo = false) => {
  try {
    const uploadOptions = {
      folder: folder || 'uploads'
    };
    if (isVideo) {
      uploadOptions.resource_type = 'video';
    } else {
      uploadOptions.resource_type = 'image';
    }
    const result = await cloudinary.v2.uploader.upload(filePath, uploadOptions);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Cloudinary upload failed');
  }
};
