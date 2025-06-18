import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/lib/models/User";
import { validateAuth } from "@/lib/utils/validateAuth";
export async function GET(req: NextRequest) {
  await connectDB();
  const auth = validateAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  try {
    let users;
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      users = await User.find({
        $or: [{ name: regex }, { email: regex }],
      });
    } else {
      users = await User.find();
    }
    return NextResponse.json(users);
  } catch (err) {
    console.error("User fetch failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
