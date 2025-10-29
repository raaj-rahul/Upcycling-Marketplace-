import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donor_name: { type: String },
  material_type: { type: String, required: true },
  quantity: { type: String, required: true }, // frontend uses string for quantity field
  condition: { type: String },
  images: [{ type: String }], // array of uploaded image paths ("/uploads/...")
  notes: { type: String },
  pickup: { type: Boolean, default: false },
  address: { type: String },
  pincode: { type: String },
  contact: { type: String },
  consent: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Donation", donationSchema);
