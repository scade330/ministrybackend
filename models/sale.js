import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    pharmacyItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
    },

    itemName: String,
    quantitySold: { type: Number, required: true, min: 1 },

    // Store prices at time of sale
    sellingPrice: Number,
    costPrice: Number,

    // Profit automatically calculated
    profit: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
