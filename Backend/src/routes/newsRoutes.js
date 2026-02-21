import express from "express";
import Article from "../models/Article.js";
import { fetchAndStoreNews } from "../services/newsService.js";

const router = express.Router();

/* TRIGGER NEWS FETCH FROM API */
router.post("/news/fetch", async (req, res) => {
  try {
    await fetchAndStoreNews('api');
    res.json({ message: "News fetched successfully" });
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* TRIGGER NEWS FETCH FROM FILE */
router.post("/news/fetch-from-file", async (req, res) => {
  try {
    await fetchAndStoreNews('file');
    res.json({ message: "News loaded from file successfully" });
  } catch {
    res.status(500).json({ message: "Load from file failed" });
  }
});

/* GET FILTER OPTIONS */
router.get("/news/filters", async (req, res) => {
  try {
    const [languages, countries, categories, dataTypes, creators] = await Promise.all([
      Article.distinct("language"),
      Article.distinct("country"),
      Article.distinct("category"),
      Article.distinct("datatype"),
      Article.distinct("creator")
    ]);

    res.json({
      languages: languages.filter(Boolean).sort(),
      countries: [...new Set(countries.flat())].filter(Boolean).sort(),
      categories: [...new Set(categories.flat())].filter(Boolean).sort(),
      contentTypes: dataTypes.filter(Boolean).sort(),
      creators: creators.flat().filter(Boolean).sort()
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* GET FILTERED NEWS */
router.get("/news", async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      author,
      language,
      country,
      category,
      content_type,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.pubDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (author) filter.creator = { $in: [author] };
    if (language) filter.language = { $in: [language] };
    if (country) filter.country = { $in: [country] };
    if (category) filter.category = { $in: category.split(",") };
    if (content_type) filter.datatype = content_type;

    const articles = await Article.find(filter)
      .sort({ pubDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Article.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({ articles, total, totalPages, page: Number(page), limit: Number(limit) });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* GET SINGLE ARTICLE */
router.get("/news/:id", async (req, res) => {
  const article = await Article.findOne({ article_id: req.params.id });
  if (!article) return res.status(404).json({ message: "Not found" });
  res.json(article);
});

export default router;