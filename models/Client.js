import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  identification: String,
  name: String,
  email: String,
  phone: String,  
  address: String
}, { timestamps: true });

export default mongoose.model("Client", clientSchema);