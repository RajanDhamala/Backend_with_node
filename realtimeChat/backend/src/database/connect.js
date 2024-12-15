import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); 
    }
};

export default connectDb;
