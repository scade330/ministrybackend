// controller/saleController.js
import Sale from "../models/sale.js";
import Pharmacy from "../models/pharmacy.js";
import mongoose from "mongoose";

// ---------------------------------------------
// 1. Record a Sale
// ---------------------------------------------
export const recordSale = async (req, res) => {
  try {
    const { pharmacyItem, quantitySold } = req.body;

    const item = await Pharmacy.findById(pharmacyItem);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.quantityInStock < quantitySold)
      return res.status(400).json({ message: "Not enough stock" });

    const sellingPrice = item.sellingPrice;
    const costPrice = item.costPrice;
    const profit = (sellingPrice - costPrice) * quantitySold;

    const sale = await Sale.create({
      pharmacyItem,
      itemName: item.itemName,
      quantitySold,
      sellingPrice,
      costPrice,
      profit,
    });

    // Update stock
    item.quantityInStock -= quantitySold;
    await item.save();

    res.json({ message: "Sale recorded", sale });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------
// 2. Get Today's Sales
// ---------------------------------------------
export const getTodaySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sales = await Sale.find({
      createdAt: { $gte: today },
    });

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------
// 3. Get Sales in Last 7 Days
// ---------------------------------------------
export const getLast7DaysSales = async (req, res) => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const sales = await Sale.find({
      createdAt: { $gte: lastWeek },
    });

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------
// 4. Get Sales in Last 30 Days
// ---------------------------------------------
export const getLast30DaysSales = async (req, res) => {
  try {
    const last30 = new Date();
    last30.setDate(last30.getDate() - 30);

    const sales = await Sale.find({
      createdAt: { $gte: last30 },
    });

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------
// 5. Get This Month's Sales
// ---------------------------------------------
export const getMonthlySales = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    const sales = await Sale.find({
      createdAt: { $gte: start },
    });

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------
// 6. Get Sales by Date Range
// ---------------------------------------------
export const getSalesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const sales = await Sale.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------
// 7. Total Profit
// ---------------------------------------------
export const getTotalProfit = async (req, res) => {
  try {
    const result = await Sale.aggregate([
      { $group: { _id: null, totalProfit: { $sum: "$profit" } } },
    ]);

    res.json(result[0] || { totalProfit: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------
// 8. Top Selling Drugs
// ---------------------------------------------
export const getTopSellingDrugs = async (req, res) => {
  try {
    const results = await Sale.aggregate([
      {
        $group: {
          _id: "$itemName",
          totalSold: { $sum: "$quantitySold" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------
// 9. Get Low Stock Drugs
// ---------------------------------------------
export const getLowStockDrugs = async (req, res) => {
  try {
    const lowStockItems = await Pharmacy.aggregate([
      {
        $project: {
          itemName: 1,
          quantityInStock: 1,
          reorderLevel: 1,
          isLow: { $lte: ["$quantityInStock", "$reorderLevel"] },
        },
      },
      { $match: { isLow: true } },
    ]);

    res.json(lowStockItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------
// 10. Dashboard Monthly Profit Chart
// ---------------------------------------------
export const getMonthlyProfit = async (req, res) => {
  try {
    const result = await Sale.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalProfit: { $sum: "$profit" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------
// 11. Fetch Sales from Last X Days
// ---------------------------------------------
export const getSalesLastDays = async (req, res) => {
  try {
    const days = parseInt(req.params.days);
    if (isNaN(days) || days <= 0) {
      return res.status(400).json({ message: "Invalid number of days." });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sales = await Sale.find({ createdAt: { $gte: startDate } })
      .populate("pharmacyItem", "itemName")
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---------------------------------------------
// 12. Delete a Sale
// ---------------------------------------------
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findById(id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    const item = await Pharmacy.findById(sale.pharmacyItem);
    if (item) {
      item.quantityInStock += sale.quantitySold;
      await item.save();
    }

    await sale.deleteOne();
    res.json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------
// 13. Profit Endpoints
// ---------------------------------------------
export const getTodayProfit = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const result = await Sale.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: null, totalProfit: { $sum: "$profit" } } },
    ]);

    res.json(result[0] || { totalProfit: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLast7DaysProfit = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const result = await Sale.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: null, totalProfit: { $sum: "$profit" } } },
    ]);

    res.json(result[0] || { totalProfit: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLast30DaysProfit = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);

    const result = await Sale.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: null, totalProfit: { $sum: "$profit" } } },
    ]);

    res.json(result[0] || { totalProfit: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
