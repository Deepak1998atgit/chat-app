import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const { name, email, image } = body;
    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, image });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "5h" }
    );
    return NextResponse.json(
      { message: "User saved", user, token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
