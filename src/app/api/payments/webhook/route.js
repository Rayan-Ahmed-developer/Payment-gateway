import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { safepay } from "@/app/lib/safepay";
import Payment from "@/app/models/Payment";

export async function POST(req) {
  await connectDB();

  // step A — quick local check: signature sahi hai ya nahi
  const signatureOk = safepay.verify.signature(req);
  if (!signatureOk) {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  const confirmed = await safepay.verify.webhook(req);

  const body = await req.json();
  const paymentId = body.order_id; // humne yehi bheja tha create route me

  if (confirmed) {
    await Payment.findByIdAndUpdate(paymentId, { status: "paid" });
  } else {
    await Payment.findByIdAndUpdate(paymentId, { status: "failed" });
  }

  return NextResponse.json({ received: true });
}