import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    chat: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    Attachments: [
      {
        type: {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
