import {GoogleGenerativeAI,SchemaType } from '@google/generative-ai';
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

  const AiJsonResponse = async () => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  
    // Enhanced schema to include more details about fruits
    const schema = {
      description: "List of fruits with their details",
      type: "array",
      items: {
        type: "object",
        properties: {
          fruitName: {
            type: "string",
            description: "Name of the fruit",
            nullable: false,
          },
          color: {
            type: "string",
            description: "Primary color of the fruit",
            nullable: false,
          },
          taste: {
            type: "string",
            description: "Taste profile of the fruit (e.g., sweet, sour)",
            nullable: true,
          },
          isSeasonal: {
            type: "boolean",
            description: "Indicates if the fruit is seasonal",
            nullable: true,
          },
        },
        required: ["fruitName", "color"],
      },
    };
  
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
  
    try {
      const result = await model.generateContent("List popular fruits with their color, taste, and whether they are seasonal.");
      const textResponse = await result.response.text();
      const fruits = JSON.parse(textResponse);
  
      console.log("Fruits data:", fruits);
      return fruits;
    } catch (error) {
      console.error("Error generating fruit data:", error);
    }
  };
    

export {
    handelText,
    handelImg,
    AiJsonResponse
    
  };