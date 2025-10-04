import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { sendPurchaseReceipt } from '@/emails'
import Order from '@/lib/db/models/order.model'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
  // Read the raw body as an ArrayBuffer so signature verification gets the exact bytes
  const buf = await req.arrayBuffer()
  const payload = new TextDecoder().decode(buf)
  const sig = req.headers.get('stripe-signature') || ''
  let event: Stripe.Event

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      // verify signature when secret is provided
      event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET as string)
    } else {
      // no webhook secret configured (e.g. local/dev) - parse body directly
      // WARNING: this skips signature verification and is INSECURE for production
      event = JSON.parse(payload) as Stripe.Event
      console.warn('STRIPE_WEBHOOK_SECRET not set - skipping signature verification')
    }
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return new NextResponse('Webhook Error: Invalid signature', { status: 400 })
  }

  try {
    // Support common successful payment events: payment_intent.succeeded, charge.succeeded and checkout.session.completed
    if (
      event.type === 'payment_intent.succeeded' ||
      event.type === 'charge.succeeded' ||
      event.type === 'checkout.session.completed'
    ) {
      let orderId: string | undefined
      let email: string | undefined
      let pricePaidInCents: number | undefined

      if (event.type === 'payment_intent.succeeded') {
        const pi = event.data.object as Stripe.PaymentIntent
        orderId = pi.metadata?.orderId
        pricePaidInCents = (pi.amount_received ?? pi.amount) as number
        // charges may not be included in the event object - retrieve full PI if needed
        if (pi.id) {
          try {
            const piFull = (await stripe.paymentIntents.retrieve(pi.id as string, {
              expand: ['charges.data.billing_details'],
            })) as Stripe.PaymentIntent & { charges?: Stripe.ApiList<Stripe.Charge> }
            email = piFull.charges?.data?.[0]?.billing_details?.email ?? pi.receipt_email ?? undefined
          } catch (err) {
            console.warn('Failed to retrieve full payment intent for email lookup', err)
            email = pi.receipt_email ?? undefined
          }
        } else {
          email = pi.receipt_email ?? undefined
        }
      } else if (event.type === 'charge.succeeded') {
        const charge = event.data.object as Stripe.Charge
        orderId = charge.metadata?.orderId
        pricePaidInCents = charge.amount as number
        email = charge.billing_details?.email ?? undefined

        // If charge metadata doesn't include orderId, try to fetch the parent payment intent metadata
        if (!orderId && charge.payment_intent) {
          try {
            const pi = await stripe.paymentIntents.retrieve(charge.payment_intent as string)
            orderId = pi.metadata?.orderId
          } catch (err) {
            console.warn('Failed to retrieve payment intent for charge:', err)
          }
        }
      } else if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        orderId = session.metadata?.orderId
        // amount info may be available on the session
        pricePaidInCents = (session.amount_total ?? session.amount_subtotal) as number | undefined

        // If session contains payment_intent, retrieve it for email/charges
        if (!email && session.payment_intent) {
          try {
            const piFull = (await stripe.paymentIntents.retrieve(session.payment_intent as string, {
              expand: ['charges.data.billing_details'],
            })) as Stripe.PaymentIntent & { charges?: Stripe.ApiList<Stripe.Charge> }
            email = piFull.charges?.data?.[0]?.billing_details?.email ?? session.customer_email ?? undefined
            pricePaidInCents = pricePaidInCents ?? ((piFull.amount_received ?? piFull.amount) as number)
            orderId = orderId ?? piFull.metadata?.orderId
          } catch (err) {
            console.warn('Failed to retrieve payment intent from checkout session:', err)
          }
        }
        email = email ?? session.customer_email ?? undefined
      }

      if (!orderId) {
        console.warn('Webhook received but no orderId could be determined from event metadata')
        return new NextResponse('No orderId found in webhook metadata', { status: 400 })
      }

      const order = await Order.findById(orderId).populate('user', 'email')
      if (order == null) {
        return new NextResponse('Order not found', { status: 400 })
      }

      order.isPaid = true
      order.paidAt = new Date()
      const obj = event.data.object as { id?: string }
      order.paymentResult = {
        id: obj.id ?? event.id,
        status: 'COMPLETED',
        email_address: email ?? (order.user as { email?: string })?.email ?? '',
        pricePaid: pricePaidInCents ? (pricePaidInCents / 100).toFixed(2) : '',
      }

      await order.save()

      try {
        await sendPurchaseReceipt({ order })
      } catch (err) {
        console.log('email error', err)
      }

      return NextResponse.json({ message: 'updateOrderToPaid was successful' })
    }

    // return success for other event types we don't process
    return new NextResponse(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error('Error handling Stripe webhook event:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
