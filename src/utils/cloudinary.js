import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, { // Corrected here
            resource_type: "auto",
        });
        fs.unlinkSync(localFilePath);
        // File has been uploaded successfully
        console.log("File uploaded successfully", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove locally saved temp file as upload failed
        console.error(error);
        return null;
    }
}

export { uploadOnCloudinary };
