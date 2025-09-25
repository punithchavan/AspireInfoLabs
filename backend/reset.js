import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/user.model.js"; // <-- correct path

dotenv.config();

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected");

    // Drop the index
    await User.collection.dropIndex("username_1");
    console.log("Index 'username_1' dropped successfully");

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (err) {
    console.error("Error dropping index:", err);
  }
};

dropIndex();
