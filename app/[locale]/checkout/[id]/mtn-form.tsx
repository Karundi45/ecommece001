"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/ui/toast";

export default function MtnForm({ totalPrice, onPaymentSuccess }: { totalPrice: number, onPaymentSuccess: () => void }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // fix: destructure toast
  const router = useRouter();

  const handleMtnPayment = async () => {
    if (!phone.startsWith("2507")) {
      toast({
        description: "Phone number must start with 2507...",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Send payment request
      const payRes = await fetch("/api/mtn/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice.toString(),
          phoneNumber: phone,
        }),
      });

      const payData = await payRes.json();

      if (!payData.success) {
        toast({ description: "Failed to request payment", variant: "destructive" });
        setLoading(false);
        return;
      }

      // 2️⃣ Poll for status with max attempts
      let status = "PENDING";
      let attempts = 0;
      const maxAttempts = 10;

      while (status === "PENDING" && attempts < maxAttempts) {
        const statusRes = await fetch("/api/mtn/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ referenceId: payData.referenceId }),
        });

        const data = await statusRes.json();
        status = data.status;

        if (status === "SUCCESSFUL") {
          toast({ description: "Payment successful ✅" });
          onPaymentSuccess();
          setLoading(false);
          return;
        } else if (status === "FAILED") {
          toast({ description: "Payment declined ❌", variant: "destructive" });
          setLoading(false);
          return;
        }

        await new Promise((r) => setTimeout(r, 3000));
        attempts++;
      }

      if (status === "PENDING") {
        toast({ description: "Payment still pending, try again later", variant: "destructive" });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast({ description: "An error occurred. Please try again.", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">MTN MoMo Phone Number</label>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="2507xxxxxxx"
        className="w-full rounded-md border px-3 py-2"
      />
      <button
        onClick={handleMtnPayment}
        disabled={loading}
        className="w-full rounded-md bg-yellow-500 py-2 font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay with MTN MoMo"}
      </button>
    </div>
  );
}
