import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Article from "../models/Article.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.API_KEY;

export const fetchAndStoreNews = async (source = 'api') => {
  try {
    let articles;

    if (source === 'file') {
      const dataPath = path.resolve(__dirname, '../../../data.json');
      console.log('Loading from:', dataPath);
      const rawData = fs.readFileSync(dataPath);
      const jsonData = JSON.parse(rawData);
      articles = jsonData.results || jsonData;
    } else {
      const { data } = await axios.get(
        `https://newsdata.io/api/1/latest?apikey=${API_KEY}`
      );
      if (!data.results) return;
      articles = data.results;
    }

    const existingCount = await Article.countDocuments();
    if (existingCount > 0 && source === 'file') {
      console.log(`Database already has ${existingCount} articles, skipping seed`);
      return;
    }

    for (const item of articles) {
      await Article.findOneAndUpdate(
        { article_id: item.article_id },
        {
          ...item,
          pubDate: item.pubDate ? new Date(item.pubDate) : null,
          fetched_at: item.fetched_at ? new Date(item.fetched_at) : null,
        },
        { upsert: true }
      );
    }

    console.log(`News synced (source: ${source})`);
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
};
