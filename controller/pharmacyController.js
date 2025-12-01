
import Pharmacy from "../models/pharmacy.js";


export const createPharmacyItem = async (req, res) => {
  try {
    const {
      itemName,
      category,
      quantityInStock,
      reorderLevel,
      costPrice,
      sellingPrice,
      batchNumber,
      expiryDate,
      supplier,
      purchaseDate,
      location,
    } = req.body;

    // Check if batchNumber already exists
    const existingItem = await Pharmacy.findOne({ batchNumber });
    if (existingItem) {
      return res.status(400).json({ message: "Batch number already exists" });
    }

    const newItem = await Pharmacy.create({
      itemName,
      category,
      quantityInStock,
      reorderLevel,
      costPrice,
      sellingPrice,
      batchNumber,
      expiryDate,
      supplier,
      purchaseDate,
      location,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllPharmacyItems = async (req, res) => {
  try {
    const items = await Pharmacy.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getPharmacyItemById = async (req, res) => {
  try {
    const item = await Pharmacy.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePharmacyItem = async (req, res) => {
  try {
    const item = await Pharmacy.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    Object.assign(item, req.body); // Update all provided fields
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deletePharmacyItem = async (req, res) => {
  try {
    // Use the efficient static' method to find and delete in one step
    const deletedItem = await Pharmacy.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      // If the item wasn't found, we correctly return a 404 here
      return res.status(404).json({ message: "Item not found" });
    }
    
    // Success response
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    // This catches errors like invalid ID format (CastError)
    res.status(500).json({ message: error.message });
  }
};

// GET /api/pharmacy/low-stock
export const getLowStockDrugs = async (req, res) => {
  try {
    // Compare quantityInStock with reorderLevel
    const lowStock = await Pharmacy.find({
      $expr: { $lte: ["$quantityInStock", "$reorderLevel"] },
    });

    res.status(200).json(lowStock);
  } catch (error) {
    console.error("LOW STOCK ERROR:", error); // logs backend error
    res.status(500).json({ message: "Error fetching low stock drugs" });
  }
};