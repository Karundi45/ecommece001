import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sell Products',
}

export default function SellProductsPage() {
  return (
    <div className='max-w-4xl mx-auto py-12 space-y-6'>
      <h1 className='text-3xl font-bold'>Sell Products on GOllira market place</h1>
      <p className='text-muted-foreground'>
        Reach millions of customers by listing your products on GOllira market place.
        We provide a simple onboarding process, secure payments, and powerful
        tools to help you manage inventory and orders.
      </p>
      <div className='space-y-4'>
        <ul className='list-disc ml-6 space-y-2'>
          <li>Fast product listing and image uploads</li>
          <li>Secure payments (Stripe, PayPal)</li>
          <li>Order management and reporting</li>
          <li>Marketing tools and promotions</li>
        </ul>
        <div className='pt-4'>
          <Button asChild size='lg' className='bg-amber-500 hover:bg-amber-600 text-white'>
            <Link href='/admin/web-pages/create'>Get started — Create a listing</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
