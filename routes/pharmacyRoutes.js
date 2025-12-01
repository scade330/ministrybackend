import express from "express";
import {
  createPharmacyItem,
  deletePharmacyItem,
  getAllPharmacyItems,
  getLowStockDrugs,
  getPharmacyItemById,
  updatePharmacyItem,
} from "../controller/pharmacyController.js";

const pharmacyrouter = express.Router();

// Create a new pharmacy item
pharmacyrouter.post("/", createPharmacyItem);

// Get all pharmacy items
pharmacyrouter.get("/", getAllPharmacyItems);
pharmacyrouter.get("/low-stock", getLowStockDrugs);

// ✅ Add /all route for dropdown
pharmacyrouter.get("/all", getAllPharmacyItems);

// Get a single pharmacy item by ID
pharmacyrouter.get("/:id", getPharmacyItemById);

// Update a pharmacy item by ID
pharmacyrouter.put("/:id", updatePharmacyItem);

// Delete a pharmacy item by ID
pharmacyrouter.delete("/:id", deletePharmacyItem);


export default pharmacyrouter;
