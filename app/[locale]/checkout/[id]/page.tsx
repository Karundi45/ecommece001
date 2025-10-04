import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import React from 'react'

import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import PaymentForm from './payment-form'

export const metadata: Metadata = {
  title: 'Payment',
}

const CheckoutPaymentPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  let client_secret = null
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2025-02-24.acacia' });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: 'USD',
      metadata: { orderId: order._id },
    });
    client_secret = paymentIntent.client_secret;
  }
  return (
    <PaymentForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      clientSecret={client_secret}
      isAdmin={session?.user?.role === 'Admin' || false}
    />
  )
  
}

export default CheckoutPaymentPage