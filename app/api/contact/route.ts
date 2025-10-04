import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const name = form.get('name') as string
  const email = form.get('email') as string
  const message = form.get('message') as string

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: SENDER_EMAIL,
      subject: 'Contact Us Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}