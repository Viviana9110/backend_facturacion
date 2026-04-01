import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createInvoice } from "../controllers/invoiceController.js";
import { getInvoices } from "../controllers/invoiceController.js";
import { getInvoiceById } from "../controllers/invoiceController.js";

const router = express.Router();

router.use(authMiddleware);

// 🔥 ESTA ES LA RUTA
router.post("/", authMiddleware, createInvoice);
router.get("/", authMiddleware, getInvoices);
router.get("/:id", authMiddleware, getInvoiceById)

export default router;