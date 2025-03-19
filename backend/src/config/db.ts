import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/todo_db');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

export default connectDB;
