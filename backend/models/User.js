import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // store hashed in production
  role: { type: String, enum: ["admin", "user", "artisan"], default: "user" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
