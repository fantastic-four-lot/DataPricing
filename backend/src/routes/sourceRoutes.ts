import { Router } from "express";
import Source from "../models/Source";

const router = Router();

// List sources
router.get("/", async (_req, res) => {
  try {
    const sources = await Source.find({});
    res.json(sources);
    // console.log(sources);
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

// Create source (no duplicate names allowed)
router.post("/", async (req, res) => {
  try {
    const { 
      name, 
      availableData, 
      buyingPrice, 
      // sellingPrice, 
      description 
    } = req.body;

    // Check if source with same name already exists (case-insensitive)
const existingSource = await Source.findOne({
  name: { $regex: `^${name.trim()}$`, $options: "i" }
});

if (existingSource) {
  return res.status(400).json({ error: "Source with this name already exists" });
}

    const src = new Source({ 
      name: name.trim(), 
      availableData, 
      buyingPrice, 
      // sellingPrice, 
      description 
    });

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
    const { 
  name, 
  availableData, 
  buyingPrice, 
  // sellingPrice, 
 
  description 
} = req.body;

    const updatedSource = await Source.findByIdAndUpdate(
      id,
      { name, availableData, buyingPrice,description },
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



// Delete source
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSource = await Source.findByIdAndDelete(id);

    if (!deletedSource) {
      return res.status(404).json({ error: "Source not found" });
    }

    res.status(200).json({ message: "Source deleted successfully", deletedSource });
  } catch (err) {
    res.status(400).json({ error: "Invalid request", details: err });
  }
});




export default router;
