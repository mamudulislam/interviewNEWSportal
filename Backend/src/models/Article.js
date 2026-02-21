import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  article_id: { type: String, unique: true, required: true },
  title: String,
  link: String,
  description: String,
  content: String,
  keywords: [String],
  creator: [String],
  language: String,
  country: [String],
  category: [String],
  datatype: String,
  pubDate: Date,
  pubDateTZ: String,
  fetched_at: Date,
  image_url: String,
  video_url: String,
  source_id: String,
  source_name: String,
  source_priority: Number,
  source_url: String,
  source_icon: String,
  duplicate: Boolean,
}, { timestamps: true });

articleSchema.index({ pubDate: -1 });
articleSchema.index({ language: 1 });
articleSchema.index({ category: 1 });
articleSchema.index({ country: 1 });
articleSchema.index({ creator: 1 });
articleSchema.index({ datatype: 1 });

export default mongoose.model("Article", articleSchema);