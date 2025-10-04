import { Metadata } from 'next'
import CheckoutForm from './checkout-form'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React from 'react'
// Removed unused import

export const metadata: Metadata = {
  title: 'Checkout',
}

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/checkout')
  }
  return <CheckoutForm />
}
