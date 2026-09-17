// components/PaymentPageDesign2.jsx
// Wired to: POST /api/payment/create  +  GET /api/payment/status/[id]

"use client";

import { useState, useEffect, useRef } from "react";

export default function Payment() {
  const [accountNumber, setAccountNumber] = useState("");
  const [status, setStatus] = useState("pending"); // pending | paid | failed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pollRef = useRef(null);

  // agar user SafePay se wapas aaya hai (redirect ke baad), purana
  // paymentId localStorage me hoga — usi ka status poll karna shuru kar do
  useEffect(() => {
    const existingId = localStorage.getItem("paymentId");
    if (existingId) startPolling(existingId);
    return () => clearInterval(pollRef.current);
  }, []);

  const startPolling = (paymentId) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status/${paymentId}`);
        const data = await res.json();
        if (data.status && data.status !== "pending") {
          setStatus(data.status);
          clearInterval(pollRef.current);
          localStorage.removeItem("paymentId");
        }
      } catch {
        // network hiccup — agli interval pe dobara try hoga
      }
    }, 2000);
  };

  const handlePay = async () => {
    setError("");

    if (!accountNumber.trim()) {
      setError("Account number likhna zaroori hai");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000, accountNumber }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kuch ghalat ho gaya");
      }

      const { paymentId, checkoutUrl } = await res.json();
      localStorage.setItem("paymentId", paymentId);
      window.location.href = checkoutUrl; // SafePay ki screen pe bhej do
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const statusLabel =
    status === "paid" ? "Paid" : status === "failed" ? "Failed" : "Pending";

  const statusBg =
    status === "paid"
      ? "bg-[#22C55E]"
      : status === "failed"
      ? "bg-[#EF4444]"
      : "bg-white/20";

  return (
    <div className="min-h-screen w-full bg-[#F2F0FF] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[20px] bg-white shadow-[0_15px_40px_-10px_rgba(76,29,149,0.3)] overflow-hidden">
        {/* Top gradient card */}
        <div className="bg-gradient-to-br from-[#5B3DF6] to-[#8A5CFF] px-7 pt-7 pb-10 text-white">
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm text-white/80">Product</span>
            <span className={`text-xs px-3 py-1 rounded-full text-white ${statusBg}`}>
              {statusLabel}
            </span>
          </div>
          <h1 className="text-2xl font-semibold mb-1">Test Premium Plan</h1>
          <p className="text-white/70 text-sm">One-time payment</p>
        </div>

        {/* Amount card */}
        <div className="px-7 -mt-6 mb-5">
          <div className="bg-white rounded-2xl shadow-md border border-[#EFEDFB] px-6 py-5 flex items-center justify-between">
            <span className="text-[#6B6B7B] text-sm">Amount</span>
            <span className="text-[#1A1A2E] text-2xl font-semibold tracking-tight">
              Rs. 1,000
            </span>
          </div>
        </div>

        {/* Account number input */}
        <div className="px-7 mb-5">
          <label className="text-[#6B6B7B] text-sm block mb-2">
            Account number
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="e.g. 0123456789"
            disabled={status === "paid" || loading}
            className="w-full border border-[#E4E1F5] rounded-xl px-4 py-3 text-sm text-[#1A1A2E] outline-none focus:border-[#5B3DF6] disabled:bg-[#F7F6FD]"
          />
          {error && <p className="text-[#EF4444] text-xs mt-2">{error}</p>}
        </div>

        <div className="px-7 pb-8">
          <button
            onClick={handlePay}
            disabled={loading || status === "paid"}
            className="w-full bg-[#1A1A2E] hover:bg-[#111122] disabled:opacity-60 text-white rounded-xl py-4 text-base font-medium transition-colors duration-200"
          >
            {status === "paid"
              ? "Payment successful"
              : loading
              ? "Redirecting..."
              : "Pay Rs. 1,000"}
          </button>
          <p className="text-center text-xs text-[#9A97AD] mt-4">
            Secured checkout · Test environment
          </p>
        </div>
      </div>
    </div>
  );
}