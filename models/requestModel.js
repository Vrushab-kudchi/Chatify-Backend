import mongoose from "mongoose";

const requestSchema = mongoose.Schema(
  {
    status: {
      type: String,
      default: "Pending",
      enum: ["pending", "accepted", "rejected"],
    },
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timestamps: true }
);

export const Request =
  mongoose.models.Request || mongoose.model("Request", requestSchema);
