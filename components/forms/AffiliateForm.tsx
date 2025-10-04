"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AffiliateForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/affiliate', { method: 'POST', body: form })
      const data = await res.json()
      if (res.ok) {
        setSuccess('Thanks — we received your application. We will be in touch soon.')
        e.currentTarget.reset()
      } else {
        setError(data?.error || 'Failed to submit, please try again later.')
      }
    } catch {
      setError('Network error, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-1'>Full name</label>
        <input aria-label='Full name' placeholder='Your full name' name='name' required className='w-full rounded border p-2 bg-black text-white' />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Email</label>
        <input aria-label='Email' placeholder='you@example.com' name='email' type='email' required className='w-full rounded border p-2 bg-black text-white' />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Website or Social</label>
        <input aria-label='Website or Social' placeholder='Your website or social profile' name='website' className='w-full rounded border p-2 bg-black text-white' />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Why do you want to join?</label>
        <textarea aria-label='Why join' placeholder='Tell us a bit about your audience' name='message' rows={5} className='w-full rounded border p-2 bg-black text-white' />
      </div>
      <div>
        <Button type='submit' disabled={loading}>{loading ? 'Sending...' : 'Sign up'}</Button>
      </div>
      {success && <p className='text-green-400 mt-2'>{success} <Link href='/page/help'>Contact us</Link> if you need anything.</p>}
      {error && <p className='text-red-400 mt-2'>{error}</p>}
    </form>
  )
}
