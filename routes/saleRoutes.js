import express from "express";
import {
  recordSale,
  getTodaySales,
  getLast7DaysSales,
  getLast30DaysSales,
  getSalesLastDays,
  getMonthlySales,
  getSalesByDateRange,
  getTotalProfit,
  getTopSellingDrugs,
  getLowStockDrugs,
  getMonthlyProfit,
  deleteSale,
  getTodayProfit,       // NEW
  getLast7DaysProfit,   // NEW
  getLast30DaysProfit,  // NEW
} from "../controller/saleController.js";

const saleRouter = express.Router();

// --- Sale operations ---
saleRouter.post("/record", recordSale);

// --- Sales reports ---
saleRouter.get("/today", getTodaySales);
saleRouter.get("/last-7-days", getLast7DaysSales);
saleRouter.get("/last-30-days", getLast30DaysSales);

// NEW: Profit endpoints
saleRouter.get("/profit/today", getTodayProfit);
saleRouter.get("/profit/7days", getLast7DaysProfit);
saleRouter.get("/profit/30days", getLast30DaysProfit);

// Last X days
saleRouter.get("/last-days/:days", getSalesLastDays);

saleRouter.get("/monthly", getMonthlySales);
saleRouter.get("/range", getSalesByDateRange);

// --- Dashboard analytics ---
saleRouter.get("/total-profit", getTotalProfit);
saleRouter.get("/top-selling", getTopSellingDrugs);
saleRouter.get("/low-stock", getLowStockDrugs);
saleRouter.get("/monthly-profit", getMonthlyProfit);

// --- Delete sale ---
saleRouter.delete("/:id", deleteSale);

export default saleRouter;
