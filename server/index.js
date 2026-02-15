import express from "express";
import cors from "cors";
import { spots, trends, feedPosts } from "./data.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/spots", (_req, res) => {
  res.json(spots);
});

app.get("/api/trends", (_req, res) => {
  res.json(trends);
});

app.get("/api/feed", (_req, res) => {
  res.json(feedPosts);
});

app.listen(PORT, () => {
  console.log(`LocalWell API running on port ${PORT}`);
});
