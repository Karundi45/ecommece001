import React from 'react'

export default function ServerErrorPage() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-lg text-center'>
        <h1 className='text-4xl font-bold mb-4'>Server error (500)</h1>
        <p className='text-gray-400'>Sorry, something went wrong on our end. Please try again later.</p>
      </div>
    </div>
  )
}
