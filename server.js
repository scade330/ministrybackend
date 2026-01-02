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

/* ----------------------------------------------------
   1️⃣ Core middleware
---------------------------------------------------- */
app.use(express.json());
app.use(cookieParser());

/* ----------------------------------------------------
   2️⃣ CORS (MUST be before routes)
---------------------------------------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://clinic2-frontend.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// ✅ REQUIRED for browser preflight requests
app.options(/.*/, cors(corsOptions));



/* ----------------------------------------------------
   3️⃣ Health check (useful on Vercel)
---------------------------------------------------- */
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

/* ----------------------------------------------------
   4️⃣ API routes
---------------------------------------------------- */
app.use("/api/user", userRouter);
app.use("/api/patientsClinic2", patientRouter);

/* ----------------------------------------------------
   5️⃣ Serve frontend (only if bundled together)
---------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendBuildPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendBuildPath));

// React Router fallback
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

/* ----------------------------------------------------
   6️⃣ Catch-all for unsupported API methods (LAST)
---------------------------------------------------- */
app.all(/^\/api\/.+$/, (req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(405).json({
    error: `Method ${req.method} not allowed`
  });
});

/* ----------------------------------------------------
   7️⃣ Start server
---------------------------------------------------- */
const startServer = async () => {
  try {
    await connectDB();
    console.log(chalk.green.bold("✅ Connected to database"));

    app.listen(PORT, () => {
      console.log(
        chalk.green.bold(`🚀 Server running on port ${PORT}`)
      );
    });
  } catch (error) {
    console.error(
      chalk.red.bold("❌ Failed to start server"),
      error
    );
    process.exit(1);
  }
};

startServer();
