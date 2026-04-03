import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/db.js";

import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoute.js";
import clientRoutes from "./routes/clientRoute.js";
import invoiceRoutes from "./routes/invoiceRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

app.use(cors({
  origin: "*",
}));

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);