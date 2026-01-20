import express from "express";
import cors from "cors";
import documentApis from "./routes/document.routes.js"
import organizationApis from "./routes/organization.routes.js"
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const app = express();

app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? "warn" : "info";
    logger[logLevel](`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});
 
app.use((req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    return next();
  }
  express.json()(req, res, next);
});

app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use("/api/documents", documentApis);
app.use("/api/organizations", organizationApis);

// Health check endpoint
app.get("/health", (req, res) => {
  logger.info("Health check requested");
  res.status(200).json({
    status: "ok",
    env: env.NODE_ENV,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error on ${req.method} ${req.path}:`, err);
  
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(env.NODE_ENV === "development" && { stack: err.stack })
  });
});

export default app;
