import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import resumeRoute from "./routes/resumeRoute.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();

// ✅ Middleware (ONLY THIS)
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// simple request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ Routes
app.use("/api/auth", authRoute);
app.use("/api/resume", resumeRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// global error handler — always respond with JSON
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ✅ Server
app.listen(5000, () => console.log("Server running on port 5000"));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});