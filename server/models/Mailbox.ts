import mongoose from "mongoose";

const mailboxSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  emailUser: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Mailbox", mailboxSchema);