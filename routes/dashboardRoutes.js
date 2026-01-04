// backend/routes/dashboardRoutes.js
import express from "express";
import { getDashboardStats } from "../controller/dashboardController.js";
import { authenticate } from "../middleware/authMiddleware.js"; // import your auth middleware

const dashboardRouter = express.Router();

// Protect the dashboard route
dashboardRouter.get("/stats", authenticate, getDashboardStats);

export default dashboardRouter;
