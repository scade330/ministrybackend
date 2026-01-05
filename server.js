import chalk from "chalk";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import userRouter from "./routes/user.js";
import patientRouter from "./routes/patientRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(cookieParser());

/* ---------------- CORS (SAFE & MODERN) ---------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ministryfrontend.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.some(o => origin.startsWith(o))) {
        return callback(null, true);
      }

      console.log(chalk.red("❌ Blocked by CORS:"), origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------------- ROUTES ---------------- */
app.use("/api/user", userRouter);
app.use("/api/patientsClinic2", patientRouter);
app.use("/api/dashboard", dashboardRouter);

/* ---------------- 404 HANDLER ---------------- */
app.use("/api", (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

/* ---------------- START SERVER ---------------- */
const startServer = async () => {
  try {
    await connectDB();
    console.log(chalk.green.bold("✅ Connected to database"));

    app.listen(PORT, () =>
      console.log(chalk.green.bold(`🚀 Server running on port ${PORT}`))
    );
  } catch (error) {
    console.error(chalk.red.bold("❌ Failed to start server"), error);
    process.exit(1);
  }
};

startServer();
