import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); 
const MONGODB_URI = process.env.MONGODB_URI;


const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:",err);
  }
};
export default connectDB;