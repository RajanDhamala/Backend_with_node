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
      const result = await model.generateContent([prompt, imagePart,'can u generate the api response for it like what ever user ask send it as the api repsonse with keys ok if array good so we can loop throuugh it send the reponse as arry ok so we can easily loop through it and send it as the response to the user and make it shout max 3 lines ok send ai response as the object with keys and value keys should be like question and then value should have answer make just one question and answer all in there ']);
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