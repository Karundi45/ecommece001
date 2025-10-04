import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import ContactForm from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Help & Contact',
}

export default function HelpPage() {
  // Server component: Contact form is a client component (ContactForm)

  return (
    <div className='max-w-4xl mx-auto py-12 px-4'>
      <h1 className='text-3xl font-bold mb-6'>Let Us Help You</h1>
      <p className='mb-6'>If you need assistance, please fill the form below and our business team will get back to you.</p>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <Link href='/page/sell-products' className='block bg-green-600 hover:bg-green-700 text-white rounded p-4 text-center'>
          Sell products on Gollira
        </Link>
        <Link href='/page/become-an-affiliate' className='block bg-blue-600 hover:bg-blue-700 text-white rounded p-4 text-center'>
          Become an Affiliate
        </Link>
        <Link href='/page/advertise-products' className='block bg-yellow-600 hover:bg-yellow-700 text-black rounded p-4 text-center'>
          Advertise Your Products
        </Link>
      </div>

      <ContactForm />

      <section className='mt-12'>
        <h2 className='text-2xl font-semibold mb-4'>Frequently asked questions</h2>
        <div className='space-y-4'>
          <details className='bg-gray-900 p-4 rounded'>
            <summary className='cursor-pointer font-medium'>How do I track my order?</summary>
            <div className='mt-2 text-sm text-gray-300'>You can track orders from your account order history or the tracking link sent to your email.</div>
          </details>
          <details className='bg-gray-900 p-4 rounded'>
            <summary className='cursor-pointer font-medium'>What is the returns policy?</summary>
            <div className='mt-2 text-sm text-gray-300'>Returns are accepted within 30 days for most items. See our Returns & Replacements page for details.</div>
          </details>
        </div>
      </section>
    </div>
  )
}
