import { auth } from "@/auth"
import { NextResponse } from "next/server"

export function GET(req) {
  console.log("Request:", req);
  const session = auth(req)
  console.log("Session:", session);


  if (req.auth) return NextResponse.json(req.auth)
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
}