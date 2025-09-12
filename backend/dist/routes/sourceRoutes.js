"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Source_1 = __importDefault(require("../models/Source"));
const router = (0, express_1.Router)();
// List sources
router.get("/", async (_req, res) => {
    try {
        const sources = await Source_1.default.find({}, "name");
        res.json(sources);
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
// Get details by ID
router.get("/:id", async (req, res) => {
    try {
        const source = await Source_1.default.findById(req.params.id);
        if (!source)
            return res.status(404).json({ error: "Source not found" });
        res.json(source);
    }
    catch {
        res.status(500).json({ error: "Server error" });
    }
});
// Create source (optional)
router.post("/", async (req, res) => {
    console.log("before req.body");
    console.log(req.body);
    console.log("aftyer req.body");
    try {
        const { name, availableData, buyingPrice, sellingPrice, enrichmentPrice, description } = req.body;
        const src = new Source_1.default({
            name,
            availableData,
            buyingPrice,
            sellingPrice,
            enrichmentPrice,
            description,
        });
        await src.save();
        res.status(201).json(src);
    }
    catch (err) {
        res.status(400).json({ error: "Invalid data", details: err });
    }
});
// Update source
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, availableData, buyingPrice, sellingPrice } = req.body;
        const updatedSource = await Source_1.default.findByIdAndUpdate(id, { name, availableData, buyingPrice, sellingPrice }, { new: true, runValidators: true } // return the updated document and validate
        );
        if (!updatedSource) {
            return res.status(404).json({ error: "Source not found" });
        }
        res.status(200).json(updatedSource);
    }
    catch (err) {
        res.status(400).json({ error: "Invalid data", details: err });
    }
});
exports.default = router;
