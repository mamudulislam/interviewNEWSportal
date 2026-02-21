import dotenv from "dotenv";
import mongoose from "mongoose";
import { fetchAndStoreNews } from "./services/newsService.js";

dotenv.config();

const runCron = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Cron: MongoDB connected");
    
    await fetchAndStoreNews('api');
    console.log("Cron: News fetched from API");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Cron failed:", err);
    process.exit(1);
  }
};

runCron();
