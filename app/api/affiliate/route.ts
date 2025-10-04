import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'
import { connectToDatabase } from '@/lib/db'
import Affiliate from '@/lib/db/models/affiliate.model'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const name = form.get('name') as string
  const email = form.get('email') as string
  const website = form.get('website') as string
  const message = form.get('message') as string

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // persist to DB
    try {
      await connectToDatabase()
      await Affiliate.create({ name, email, website, message })
    } catch (dbErr) {
      // proceed even if DB write fails — log server-side
      console.error('Affiliate save error', dbErr)
    }
    await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: SENDER_EMAIL,
      subject: 'New Affiliate Signup',
      text: `Name: ${name}\nEmail: ${email}\nWebsite/Social: ${website}\nMessage: ${message}`,
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}