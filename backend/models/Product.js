import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String }, // store URL path to /uploads/filename
  artisan: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
