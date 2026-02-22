import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    to: String,
    from: String,
    subject: String,
    body: String,

    deletedBySender: {
      type: Boolean,
      default: false,
    },

    deletedByReceiver: {
      type: Boolean,
      default: false,
    },

    starred: {
      type: Boolean,
      default: false,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Email", emailSchema);
