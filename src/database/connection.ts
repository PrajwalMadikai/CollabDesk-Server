import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config()

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI ;

    if(!mongoURI)
    {
        console.log("No mongodb env")
        return 
    }

    await mongoose.connect(mongoURI);
    console.log('Database connected');

  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
