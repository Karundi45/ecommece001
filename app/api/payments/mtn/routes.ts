import { NextResponse } from "next/server"
import axios from "axios"
import crypto from 'crypto'

const BASE_URL = "https://sandbox.momodeveloper.mtn.com"
const SUBSCRIPTION_KEY = process.env.MTN_SUBSCRIPTION_KEY!
const USER_ID = process.env.MTN_USER_ID!
const API_KEY = process.env.MTN_API_KEY!

async function getAccessToken() {
  const res = await axios.post(
    `${BASE_URL}/collection/token/`,
    {},
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${USER_ID}:${API_KEY}`).toString("base64"),
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
      },
    }
  )
  const data = res.data as { access_token?: string }
  return data.access_token
}

export async function POST(req: Request) {
  try {
    const { amount, phoneNumber, orderId } = await req.json()
    const token = await getAccessToken()
    const referenceId = crypto.randomUUID()

    await axios.post(
      `${BASE_URL}/collection/v1_0/requesttopay`,
      {
        amount,
        currency: "RWF",
        externalId: orderId,
        payer: { partyIdType: "MSISDN", partyId: phoneNumber },
        payerMessage: "Payment for order " + orderId,
        payeeNote: "Thanks for shopping",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Reference-Id": referenceId,
          "X-Target-Environment": "sandbox",
          "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
          "Content-Type": "application/json",
        },
      }
    )

    return NextResponse.json({ success: true, referenceId })
  } catch (err: unknown) {
    let message = 'Unknown error';
    if (err && typeof err === 'object' && 'message' in err) {
      message = (err as { message: string }).message;
    }
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    )
  }
}
