"use client"

import { useState } from "react"
const COUNTRY_CODES = [
  { code: "+250", label: "🇷🇼 Rwanda" },
  { code: "+256", label: "🇺🇬 Uganda" },
  { code: "+255", label: "🇹🇿 Tanzania" },
  { code: "+237", label: "🇨🇲 Cameroon" },
  { code: "+233", label: "🇬🇭 Ghana" },
  { code: "+234", label: "🇳🇬 Nigeria" },
  { code: "+225", label: "🇨🇮 Côte d'Ivoire" },
  { code: "+226", label: "🇧🇫 Burkina Faso" },
  { code: "+227", label: "🇳🇪 Niger" },
  { code: "+228", label: "🇹🇬 Togo" },
  { code: "+229", label: "🇧🇯 Benin" },
  { code: "+230", label: "🇲🇺 Mauritius" },
  { code: "+231", label: "🇱🇷 Liberia" },
  { code: "+232", label: "🇸🇱 Sierra Leone" },
  { code: "+243", label: "🇨🇩 DR Congo" },
  { code: "+265", label: "🇲🇼 Malawi" },
  { code: "+266", label: "🇱🇸 Lesotho" },
  { code: "+267", label: "🇧🇼 Botswana" },
  { code: "+268", label: "🇸🇿 Eswatini" },
  // Add more as needed
];

export default function MtnForm({
  totalPrice,
  orderId,
}: {
  totalPrice: number
  orderId: string
}) {
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code)
  const [phoneNumber, setPhoneNumber] = useState("")

  // Auto-detect country code if user types +250, +256, etc.
  const handlePhoneInput = (val: string) => {
    // Remove all non-digit and plus
    let input = val.replace(/[^\d+]/g, "")
    // If input starts with + and matches a country code, auto-select
    const match = COUNTRY_CODES.find(opt => input.startsWith(opt.code))
    if (match) {
      setCountryCode(match.code)
      // Remove country code from input for phone field
      input = input.slice(match.code.length)
    }
    // Only keep digits for phone number
    setPhoneNumber(input.replace(/\D/g, ""))
  }
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>("")

  // Simple phone validation: must be digits and 9-10 chars (after country code)
  const validatePhone = (num: string) => /^\d{9,10}$/.test(num)

  const handleMtnPay = async (): Promise<void> => {
    setLoading(true)
    setMessage("")
    if (!validatePhone(phoneNumber)) {
      setMessage("Please enter a valid phone number (9-10 digits, no spaces)")
      setLoading(false)
      return
    }
    try {
      const fullPhone = countryCode.replace("+", "") + phoneNumber
      const res = await fetch("/api/payments/mtn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          phoneNumber: fullPhone,
          orderId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage("Payment request sent. Approve it on your MTN phone.")
      } else {
        setMessage("Payment failed: " + data.message)
      }
    } catch (err) {
      let errorMsg = 'Unknown error';
      if (err instanceof Error) errorMsg = err.message;
      setMessage("Error: " + errorMsg)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium mb-1">MTN MoMo Phone Number</label>
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={e => setCountryCode(e.target.value)}
          className="border rounded p-2 bg-white font-semibold min-w-[110px]"
          aria-label="Country code"
        >
          {COUNTRY_CODES.map(opt => (
            <option key={opt.code} value={opt.code}>{opt.label} ({opt.code})</option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]{9,10}"
          maxLength={10}
          minLength={9}
          placeholder="7x xxx xxxx or +2507x..."
          value={phoneNumber}
          onChange={e => handlePhoneInput(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
      </div>
      <div className="text-xs text-gray-500 mb-1">Include only digits after country code. Example: <b>7xxxxxxxx</b></div>
      <button
        onClick={handleMtnPay}
        disabled={loading}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded font-bold transition"
      >
        {loading ? "Processing..." : "Pay with MTN MoMo"}
      </button>
      {message && <p className="text-sm mt-1 text-red-600">{message}</p>}
    </div>
  )
}
