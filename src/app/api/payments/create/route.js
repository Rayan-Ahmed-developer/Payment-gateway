import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { safepay } from "@/app/lib/safepay";
import Payment from "@/app/models/Payment";

export async function POST(req) {
  await connectDB();
  const { amount, accountNumber } = await req.json();

  // basic check — auth nahi, bas empty na ho
  if (!amount || !accountNumber) {
    return NextResponse.json(
      { error: "amount aur accountNumber dono chahiye" },
      { status: 400 }
    );
  }

  // 1) apna pending record
  const payment = await Payment.create({
    amount,
    accountNumber,
    status: "pending",
  });

  // 2) SafePay se token (service call)
  const { token } = await safepay.payments.create({
    amount: amount * 100,
    currency: "PKR",
  });

  payment.safePayToken = token;
  await payment.save();

  // 3) checkout link
  const checkoutUrl = safepay.checkout.create({
    token,
    orderId: payment._id.toString(),
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    source: "custom",
    webhooks: true,
  });

  return NextResponse.json({ paymentId: payment._id, checkoutUrl });
}