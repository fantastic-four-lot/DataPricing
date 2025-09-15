import { Router } from "express";
import Transaction from "../models/Transaction";

const router = Router();

// ✅ Create transaction
router.post("/", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err });
  }
});

// ✅ Get all transactions (history)
router.get("/", async (_req, res) => {
  try {
    const history = await Transaction.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
