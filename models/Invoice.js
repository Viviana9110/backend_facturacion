import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number
    }
  ],
  subtotal: Number,
  tax: Number,
  total: Number,

  factusId: Number,
  referenceCode: String,
  dianNumber: String,
  qrCode: String,
  publicUrl: String

}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);