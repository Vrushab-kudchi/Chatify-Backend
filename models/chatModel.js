import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
