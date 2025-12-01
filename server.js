import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

import postRouter from './routes/post.js';
import userRouter from './routes/user.js';
import patientRouter from './routes/patientRoutes.js';
import pharmacyrouter from './routes/pharmacyRoutes.js';
import salesRouter from './routes/saleRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());

// CORS configuration for frontend
app.use(cors({
  origin: "https://clinic-frontend-orcin.vercel.app", // Replace with your frontend URL
  credentials: true, // Allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow methods
}));

// --- Health check route ---
app.get("/healthz", (req, res) => res.status(200).send("OK"));

// --- API Routes ---
app.use("/api/patients", patientRouter);
app.use("/api/pharmacy", pharmacyrouter);
app.use("/api/sales", salesRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

// --- Serve React frontend ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendBuildPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendBuildPath));

// React Router fallback for all non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// Catch-all for unmatched API routes/methods (405)
app.all(/^\/api\/.*$/, (req, res) => {
  res.status(405).send("Method Not Allowed");
});

// --- Start server ---
const startServer = async () => {
  try {
    await connectDB();
    console.log(chalk.green.bold("Connected to database"));

    app.listen(PORT, () => {
      console.log(chalk.green.bold(`Server listening on port ${PORT}`));
    });
  } catch (err) {
    console.error(chalk.red.bold("Failed to start server:"), err);
    process.exit(1);
  }
};

startServer();
