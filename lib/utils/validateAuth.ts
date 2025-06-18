import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!
export function validateAuth(req: NextRequest): { userId: string; email: string } | NextResponse {
  const authHeader = req?.headers?.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized"},
      { status: 401 }
    );
  }
  const token = authHeader.replace("Bearer ","");
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded; 
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.json(
      { message: "Unauthorized"},
      { status: 401 }
    );
  }
}
