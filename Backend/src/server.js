import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import newsRoutes from "./routes/newsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { fetchAndStoreNews } from "./services/newsService.js";
import { startNewsCron } from "./cron/newsCron.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000","https://tubular-chimera-9e8fde.netlify.app"],
  credentials: true
}));
app.use(express.json());
app.use("/api", newsRoutes);
app.use("/api/auth", authRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ MongoDB connected");
    
    startNewsCron();
    
    await fetchAndStoreNews('file');
    
    app.listen(5000, () => {
      console.log("✓ Server running on port 5000");
      console.log("📰 Cron jobs active - fetching latest news every hour");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();