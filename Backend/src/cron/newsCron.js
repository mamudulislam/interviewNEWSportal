import cron from "node-cron";
import { fetchAndStoreNews } from "../services/newsService.js";

export const startNewsCron = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("Running hourly scheduled ingestion from API...");
    await fetchAndStoreNews('api');
  });
};