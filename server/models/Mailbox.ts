import mongoose from "mongoose";

const mailboxSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Mailbox", mailboxSchema);
