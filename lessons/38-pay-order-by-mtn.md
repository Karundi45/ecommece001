# Lesson 20: Pay Order by MTN Mobile Money

In this lesson, we will integrate **MTN MoMo API** into our checkout process.

---

## 1. Create MTN Payment Form

Inside `app/checkout/[id]/mtn-form.tsx`:

```tsx
"use client"

import { useState } from "react"

export default function MtnForm({
  totalPrice,
  orderId,
}: {
  totalPrice: number
  orderId: string
}) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleMtnPay = async () => {
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch("/api/payments/mtn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice, phoneNumber, orderId }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage("Payment request sent. Approve on your MTN phone.")
      } else {
        setMessage("Payment failed: " + data.message)
      }
    } catch (err: any) {
      setMessage("Error: " + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Enter MTN Phone Number (2507xxxxxxx)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        onClick={handleMtnPay}
        disabled={loading}
        className="w-full bg-yellow-500 text-white p-2 rounded"
      >
        {loading ? "Processing..." : "Pay with MTN MoMo"}
      </button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  )
}
