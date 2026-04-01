import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient
} from "../controllers/clientController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createClient);
router.get("/", getClients);
router.get("/:id", getClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;