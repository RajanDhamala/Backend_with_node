import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

export const imageORvideoUpload = async(filepath,folder,contentType)=>{
    try{
        const uploadOptions={
            folder:folder || 'uploads'
        };
        if(contentType==='video'){
            uploadOptions.resource_type='video';
        }else{
            uploadOptions.resource_type='image';
        }
        const result=await cloudinary.v2.uploader.upload(filepath,uploadOptions);
        return result.secure_url;
    }catch(error){
        console.error('Cloudinary upload error:',error);
        throw new Error('Cloudinary upload failed');
    }
}