import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Product from "../models/Product.js";

const router = express.Router();

// Ensure uploads folder exists
const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e6)}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

// Create product (with optional image)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      artisan: req.body.artisan,
      image: imagePath
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update (optionally replace image)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      artisan: req.body.artisan
    };
    if (req.file) data.image = `/uploads/${req.file.filename}`;

    const updated = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
