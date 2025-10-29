import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Donation from "../models/Donation.js";

const router = express.Router();

const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer storage for multiple images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e6)}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

// ------------ Pincode check endpoint (used by frontend) ------------
// The frontend calls: /api/check-pincode?code=560001
// We'll return a JSON shape:
// { serviceable: boolean, region: "City/State", message: "...", code: "560001" }
//
// NOTE: In production you may want to integrate with a proper postal API.
// For now we implement a simple rule: valid 6-digit pincode => serviceable if starting digit is in allowed list.
// You can customize the list below.
const SERVICEABLE_PREFIXES = ["5", "6", "7", "8"]; // adjust to your region(s)

router.get("/check-pincode", (req, res) => {
  const code = String(req.query.code || "").trim();
  const isValid = /^[1-9][0-9]{5}$/.test(code);
  if (!isValid) {
    return res.status(400).json({ serviceable: false, code, message: "Invalid pincode format." });
  }

  const prefix = code[0];
  const serviceable = SERVICEABLE_PREFIXES.includes(prefix);
  const region = serviceable ? "Serviceable Region" : "Outside service area";
  const message = serviceable
    ? "Pickup available in this area."
    : "Sorry, pickup is not available in this pincode.";

  res.json({ serviceable, code, region, message });
});

// ------------ Donations endpoint (multipart/form-data) ------------
// Accepts fields:
// - donor_name (optional), material_type (required), quantity (required), condition (optional)
// - notes, pickup (true/false), address, pincode, contact, consent (true/false)
// - images: array of image files (input name = "images")
router.post("/donations", upload.array("images", 6), async (req, res) => {
  try {
    // Multer parsed files
    const files = req.files || [];
    const imagePaths = files.map(f => `/uploads/${f.filename}`);

    // Because form-data sends booleans/checkboxes as strings, normalize:
    const pickup = req.body.pickup === "true" || req.body.pickup === "on" || req.body.pickup === true;
    const consent = req.body.consent === "true" || req.body.consent === "on";

    const donation = new Donation({
      donor_name: req.body.donor_name || null,
      material_type: req.body.materialType || req.body.material_type || req.body.material || req.body.materialType,
      quantity: req.body.quantity,
      condition: req.body.condition,
      images: imagePaths,
      notes: req.body.notes,
      pickup,
      address: req.body.address,
      pincode: req.body.pincode,
      contact: req.body.contact,
      consent
    });

    await donation.save();

    // A friendly response — frontend can read id or other fields
    res.status(201).json({ message: "Donation recorded", donationId: donation._id, donation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read donations (optional admin usage)
router.get("/donations", async (req, res) => {
  try {
    const list = await Donation.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read single donation
router.get("/donations/:id", async (req, res) => {
  try {
    const d = await Donation.findById(req.params.id);
    if (!d) return res.status(404).json({ message: "Donation not found" });
    res.json(d);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
