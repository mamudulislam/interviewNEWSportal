import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Article from './src/models/Article.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const dataPath = path.join(__dirname, 'data.json');
        const rawData = fs.readFileSync(dataPath);
        const jsonData = JSON.parse(rawData);

        const articles = jsonData.results || jsonData;

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

        console.log(`Seeded ${articles.length} articles`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
