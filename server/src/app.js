import express from "express";
import cors from "cors";
import documentApis from "./routes/document.routes.js"
import organizationApis from "./routes/organization.routes.js"
import { env } from "./config/env.js";

const app = express();

app.use(cors());
 
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
  res.status(200).json({
    status: "ok",
    env: env.NODE_ENV,
  });
});

export default app;
