import cron from "node-cron";
import { fetchAndStoreNews } from "../services/newsService.js";

export const startNewsCron = () => {
  // Run every hour at minute 0 (H:00)
  const task = cron.schedule("0 * * * *", async () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Starting hourly news fetch from API...`);
    try {
      await fetchAndStoreNews('api');
      console.log(`[${timestamp}] Hourly news fetch completed successfully`);
    } catch (err) {
      console.error(`[${timestamp}] Hourly news fetch failed:`, err.message);
    }
  });
  
  console.log("✓ Cron job scheduled: Fetch latest news every hour at the top of the hour");
  return task;
};