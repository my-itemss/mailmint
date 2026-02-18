import mongoose from "mongoose";

const mailboxSchema = new mongoose.Schema({
 email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Mailbox", mailboxSchema);
