import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const MessageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
  },
  { timestamps: true }
);

const Message = models.Message || model("Message", MessageSchema);
export default Message;
