import {GoogleGenerativeAI} from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const handelText=async(prompt)=>{
    const genAI = new GoogleGenerativeAI(process.env.Api_Key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt2 = prompt;
    
    const result = await model.generateContent(prompt2);
    console.log(result.response.text());
    return result.response.text();
}

const handelImg = async (prompt, path) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
    const fileToGenerativePart = (path, mimeType) => {
      return {
        inlineData: {
          data: Buffer.from(fs.readFileSync(path)).toString('base64'),
          mimeType,
        },
      };
    };
    const imagePart = fileToGenerativePart(path, 'image/jpeg');
  
    try {
      const result = await model.generateContent([prompt, imagePart]);
      console.log(result.response.text());
      return result.response.text(); 
    } catch (error) {
      console.error('Error handling image:', error);
      throw new Error('Failed to process image with AI.');
    }
  };
  

export {
    handelText,
    handelImg};