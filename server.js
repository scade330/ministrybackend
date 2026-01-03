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

/* -----------------------------
   Remove duplicate slashes in URLs
----------------------------- */
app.use((req, res, next) => {
  req.url = req.url.replace(/\/+/g, "/");
  next();
});

/* -----------------------------
   Logging for debugging
----------------------------- */
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log(`Origin header: ${req.headers.origin}`);
  next();
});

/* -----------------------------
   Core middleware
----------------------------- */
app.use(express.json());
app.use(cookieParser());

/* -----------------------------
   CORS configuration (works for preflight automatically)
----------------------------- */
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://ministrybackend.vercel.app" // production frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman / server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -----------------------------
   API routes (preflight handled automatically by cors middleware)
----------------------------- */
app.use("/api/user", userRouter);
app.use("/api/patientsClinic2", patientRouter);

/* -----------------------------
   Catch-all for invalid API routes
----------------------------- */
app.use("/api", (req, res) => {
  res.status(405).json({
    error: `Method ${req.method} not allowed for this route`,
  });
});

/* -----------------------------
   Serve frontend (if bundled)
----------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendBuildPath));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

/* -----------------------------
   Start server
----------------------------- */
const startServer = async () => {
  try {
    await connectDB();
    console.log(chalk.green.bold("✅ Connected to database"));

    app.listen(PORT, () => {
      console.log(chalk.green.bold(`🚀 Server running on port ${PORT}`));
    });
  } catch (error) {
    console.error(chalk.red.bold("❌ Failed to start server"), error);
    process.exit(1);
  }
};

startServer();
