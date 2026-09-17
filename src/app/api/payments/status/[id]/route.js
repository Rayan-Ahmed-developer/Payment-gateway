// app/api/payment/status/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Payment from "@/app/models/Payment";

export async function GET(req, { params }) {
  await connectDB();
  const payment = await Payment.findById(params.id);
  if (!payment) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ status: payment.status });
}