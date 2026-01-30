import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  to: String,
  from: String,
  subject: String,
  body: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Email", emailSchema);
