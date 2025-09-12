import { Router } from "express";
import Source from "../models/Source";

const router = Router();

// List sources
router.get("/", async (_req, res) => {
  try {
    const sources = await Source.find({}, "name");
    res.json(sources);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get details by ID
router.get("/:id", async (req, res) => {
  try {
    const source = await Source.findById(req.params.id);
    if (!source) return res.status(404).json({ error: "Source not found" });
    res.json(source);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Create source (optional)
router.post("/", async (req, res) => {
  try {
    const { name, availableData, buyingPrice, enrichmentPrice, sellingPrice } = req.body;
    const src = new Source({ name, availableData, buyingPrice, enrichmentPrice, sellingPrice });
    await src.save();
    res.status(201).json(src);
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err });
  }
});

// Update source
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, availableData, buyingPrice, enrichmentPrice, sellingPrice } = req.body;

    const updatedSource = await Source.findByIdAndUpdate(
      id,
      { name, availableData, buyingPrice, enrichmentPrice, sellingPrice },
      { new: true, runValidators: true } // return the updated document and validate
    );

    if (!updatedSource) {
      return res.status(404).json({ error: "Source not found" });
    }

    res.status(200).json(updatedSource);
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err });
  }
});


export default router;
