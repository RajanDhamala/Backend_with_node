import {GoogleGenerativeAI} from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import { stringify } from 'flatted';


dotenv.config();

const handelText = async (prompt) => {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
    });

    const result = await chat.sendMessageStream(prompt);

    let finalResponse = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text(); 
      process.stdout.write(chunkText); 
      finalResponse += chunkText; 
    }

    return finalResponse; 
  } catch (error) {
    console.error("Error handling text:", error);
    throw error;
  }
};


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
      const result = await model.generateContent([prompt, imagePart,'']);
      console.log(result.response.text());
      return result.response.text(); 
    } catch (error) {
      console.error('Error handling image:', error);
      throw new Error('Failed to process image with AI.');
    }
  };

  const AiJsonResponse = async () => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
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

const ChatwithAi = async (message, { user }, chats = 'no prev chats') => {
  if (!message || !user || !chats) {
    return { error: "Invalid request data." };
  }

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
  });

  try {
    const result = await model.generateContent(message);
    const responseText = result.response.text();
    console.log(responseText);
    const resultString = stringify(result);
    console.log(resultString);

    return responseText;

  } catch (error) {
    console.error("Error in ChatwithAi:", error);
    throw error;
  }
};

export {
    handelText,
    handelImg,
    AiJsonResponse,
    ChatwithAi
  };