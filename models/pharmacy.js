import mongoose from "mongoose";

const { Schema } = mongoose;

const pharmacySchema = new Schema(
  {
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: [2, "Item name must be at least 2 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    quantityInStock: {
      type: Number,
      required: [true, "Quantity in stock is required"],
      min: [0, "Quantity cannot be negative"],
    },

    reorderLevel: {
      type: Number,
      required: [true, "Reorder level is required"],
      min: [0, "Reorder level cannot be negative"],
    },

    costPrice: {
      type: Number,
      required: [true, "Cost price is required"],
      min: [0, "Cost price cannot be negative"],
    },

    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Selling price cannot be negative"],
    },

    batchNumber: {
      type: String,
      required: [true, "Batch number is required"],
      trim: true,
      unique: true,
    },

    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },

    supplier: {
      type: String,
      required: [true, "Supplier is required"],
      trim: true,
    },

    purchaseDate: {
      type: Date,
      required: [true, "Purchase date is required"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
export default Pharmacy;
