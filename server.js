import chalk from "chalk";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import userRouter from "./routes/user.js";
import patientRouter from "./routes/patientRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

/* ---------------------------------
   Normalize URLs
---------------------------------- */
app.use((req, res, next) => {
  req.url = req.url.replace(/\/+/g, "/");
  next();
});

/* ---------------------------------
   Core middleware
---------------------------------- */
app.use(express.json());
app.use(cookieParser());

/* ---------------------------------
   ✅ CORS — FINAL & SAFE
---------------------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://ministryfrontend.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
};

/* 🔥 CORS before routes */
app.use(cors(corsOptions));

/* 🔥 VALID preflight handler (RegExp — NO CRASH) */
app.options(/.*/, cors(corsOptions));

/* ---------------------------------
   API routes
---------------------------------- */
app.use("/api/user", userRouter);
app.use("/api/patientsClinic2", patientRouter);

/* ---------------------------------
   Invalid API route handler
---------------------------------- */
app.use("/api", (req, res) => {
  res.status(405).json({
    error: `Method ${req.method} not allowed`,
  });
});

/* ---------------------------------
   Serve frontend build (optional)
---------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendBuildPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

/* ---------------------------------
   Start server
---------------------------------- */
const startServer = async () => {
  try {
    await connectDB();
    console.log(chalk.green.bold("✅ Database connected"));

    app.listen(PORT, () => {
      console.log(
        chalk.green.bold(`🚀 Server running on port ${PORT}`)
      );
    });
  } catch (error) {
    console.error(
      chalk.red.bold("❌ Server failed to start"),
      error
    );
    process.exit(1);
  }
};

startServer();
