import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const ConversationSchema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Conversation =
models.Conversation || model("Conversation", ConversationSchema);
export default Conversation;
