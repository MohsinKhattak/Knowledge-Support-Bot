import express from "express";
import cors from "cors";

import { env } from "./config/env.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    env: env.NODE_ENV,
  });
});



export default app;
