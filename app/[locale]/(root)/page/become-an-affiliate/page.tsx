import React from 'react'
import type { Metadata } from 'next'
import AffiliateForm from '@/components/forms/AffiliateForm'

export const metadata: Metadata = {
  title: 'Become an Affiliate',
}

export default function AffiliatePage() {
  return (
    <main className="max-w-6xl mx-auto py-16 px-6">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Join the Gollira Affiliate Program</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Earn competitive commissions by promoting products on Gollira. Get access to exclusive deals, tracking tools,
          and performance-based rewards.
        </p>
        <div className="mt-8 flex justify-center">
          <a href="#signup" className="inline-block rounded-md bg-primary px-6 py-3 text-white font-semibold">
            Apply to join
          </a>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">High commissions</h3>
          <p className="text-sm text-muted-foreground">Competitive rates for a wide range of product categories.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Simple reporting</h3>
          <p className="text-sm text-muted-foreground">Real-time tracking and clear payout reports to monitor your performance.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">No cost to join</h3>
          <p className="text-sm text-muted-foreground">Sign up free and start sharing links right away.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
          <li>Create an account and apply to the program.</li>
          <li>Grab your affiliate links or banners from the dashboard.</li>
          <li>Share links on your website, social channels, or email.</li>
          <li>Earn commissions when customers buy through your links.</li>
        </ol>
      </section>

      {/* Signup / form */}
      <section id="signup" className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-3">Ready to start earning?</h2>
          <p className="text-muted-foreground mb-4">Fill the quick form and our team will review your application.</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Fast approvals</li>
            <li>• Dedicated affiliate support</li>
            <li>• Flexible payout options</li>
          </ul>
        </div>
        <div className="p-6 border rounded-lg">
          <AffiliateForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="font-semibold">Who can join?</h3>
            <p className="text-sm">Anyone with an online presence — bloggers, content creators, and publishers are welcome.</p>
          </div>
          <div>
            <h3 className="font-semibold">How do I get paid?</h3>
            <p className="text-sm">We offer multiple payout methods. Visit the dashboard to choose your preferred option.</p>
          </div>
          <div>
            <h3 className="font-semibold">Is there a minimum traffic requirement?</h3>
            <p className="text-sm">No strict minimums — applications are reviewed holistically.</p>
          </div>
        </div>
      </section>

      <p className="text-center text-sm text-muted-foreground">By applying you agree to our affiliate terms and policies.</p>
    </main>
  )
}
