import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { validateAuth } from "@/lib/utils/validateAuth";
import User from "@/lib/models/User";
import Conversation from "@/lib/models/Conversation";
import Message from "@/lib/models/Message";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1. Validate user from JWT
    const user = validateAuth(req);
    if (user instanceof NextResponse) return user;
    const { userId } = user;

    // 2. Get receiver email from query
    const { searchParams } = new URL(req.url);
    const receiver = searchParams.get("receiver");
    if (!receiver) {
      return NextResponse.json(
        { message: "Receiver email is required" },
        { status: 400 }
      );
    }

    // 3. Find sender and receiver users
    const senderUser = await User.findById(userId);
    const receiverUser = await User.findOne({ email: receiver });

    if (!senderUser || !receiverUser) {
      return NextResponse.json(
        { message: "User(s) not found" },
        { status: 404 }
      );
    }

    // 4. Check if a conversation exists between them
    const existingConversation = await Conversation.findOne({
      participants: { $all: [senderUser._id, receiverUser._id], $size: 2 },
    });

    if (!existingConversation) {
      return NextResponse.json(
        { messages: [], message: "No conversation found" },
        { status: 200 }
      );
    }

    // 5. Get messages, sorted oldest to newest
    const messages = await Message.find({
      conversation: existingConversation._id,
    })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: 1 }) // chronological order
      .lean();

    // 6. Return messages
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/messages:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
