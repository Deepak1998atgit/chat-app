import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./db/connection.js";
import Conversation from "./db/models/conversation.js";
import Message from "./db/models/message.js";
import User from "./db/models/user.js";

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

connectDB();

io.on("connection", (socket) => {
  socket.on("send-message", async (data) => {
    const { sender, receiver, content } = data;

    try {
      const senderUser = await User.findOne({ email: sender });
      const receiverUser = await User.findOne({ email: receiver });
      if (!senderUser || !receiverUser) {
        console.error("One or both users not found");
        return;
      }
      let conversation = await Conversation.findOne({
        participants: { $all: [senderUser._id, receiverUser._id], $size: 2 },
      });
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderUser._id, receiverUser._id],
        });
      }
      const message = await Message.create({
        conversation: conversation._id,
        sender: senderUser._id,
        content,
      });
      socket.broadcast.emit("receive-message", {
        id: message._id,
        sender,
        receiver,
        content,
        conversationId: conversation._id,
        createdAt: message.createdAt,
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
