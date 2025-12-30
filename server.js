import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

import userRouter from './routes/user.js';
import patientRouter from './routes/patientRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());

// --- CORS configuration ---
const allowedOrigins = [
  "http://localhost:5173",                      // local frontend
  "https://clinic2-frontend.vercel.app",       // deployed frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));

// Handle preflight requests for API routes
app.options(/^\/api\/.*$/, cors(corsOptions));

// --- Health check ---
app.get("/healthz", (req, res) => res.status(200).send("OK"));

// --- API Routes ---
app.use("/api/patientsClinic2", patientRouter);
app.use("/api/user", userRouter);

// --- Serve React frontend ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendBuildPath));

// React Router fallback for non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// --- Catch-all for unmatched API methods (405) ---
app.all(/^\/api\/.+$/, (req, res) => {
  res.status(405).json({ error: `Method ${req.method} not allowed` });
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
