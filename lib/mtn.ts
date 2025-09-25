import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, phoneNumber } = req.body;

    // 🔑 Step 1: Get Access Token
    const tokenRes = await axios.post(
      "https://sandbox.momodeveloper.mtn.com/collection/token/",
      {},
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY!,
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.MTN_USER_ID + ":" + process.env.MTN_API_KEY
            ).toString("base64"),
        },
      }
    );

    const accessToken = tokenRes.data.access_token;
    const referenceId = crypto.randomUUID();

    // 🔑 Step 2: Request Payment
    await axios.post(
      "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
      {
        amount,
        currency: "RWF", // Rwanda Franc
        externalId: referenceId,
        payer: {
          partyIdType: "MSISDN",
          partyId: phoneNumber, // e.g. 2507xxxxxxx
        },
        payerMessage: "Order Payment",
        payeeNote: "Thanks for your order",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Reference-Id": referenceId,
          "X-Target-Environment": "sandbox", // change to "production" in live
          "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({ success: true, referenceId });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: "MTN MoMo payment failed" });
  }
}
