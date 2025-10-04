"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ContactForm() {
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
      const res = await fetch('/api/contact', { method: 'POST', body: form })
      const data = await res.json()
      if (res.ok) {
        setSuccess('Thanks — we received your message. We will reply within 24-48 hours.')
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
    <form id='contact-form' onSubmit={handleSubmit} className='space-y-4 max-w-xl'>
      <div>
        <label className='block text-sm font-medium mb-1'>Full name</label>
        <input aria-label='Full name' placeholder='Your full name' name='name' required className='w-full rounded border p-2 bg-black text-white' />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Email</label>
        <input aria-label='Email' placeholder='you@example.com' name='email' type='email' required className='w-full rounded border p-2 bg-black text-white' />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Subject</label>
        <input aria-label='Subject' placeholder='Short subject' name='subject' required className='w-full rounded border p-2 bg-black text-white' />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Message</label>
        <textarea aria-label='Message' placeholder='How can we help?' name='message' required rows={6} className='w-full rounded border p-2 bg-black text-white' />
      </div>

      <div className='flex items-center gap-2'>
        <Button type='submit' disabled={loading}>{loading ? 'Sending...' : 'Submit'}</Button>
        <p className='text-sm text-gray-400'>We aim to respond within 24–48 hours.</p>
      </div>
      {success && <p className='text-green-400 mt-2'>{success}</p>}
      {error && <p className='text-red-400 mt-2'>{error}</p>}
    </form>
  )
}
