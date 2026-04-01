import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  quantity: Number,
  price: Number,
  tax_rate: Number
}, { timestamps: true });

export default mongoose.model("Product", productSchema);