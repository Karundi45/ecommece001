import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Advertise Your Products',
}

export default function AdvertisePage() {
  return (
    <div className='max-w-4xl mx-auto py-12 space-y-6'>
      <h1 className='text-3xl font-bold'>Advertise Your Products</h1>
      <p className='text-muted-foreground'>
        Increase visibility with sponsored placements, targeted promotions, and
        daily deals. Reach customers at the right moment and boost your sales.
      </p>
      <div className='pt-4'>
        <Button asChild size='lg' className='bg-amber-500 hover:bg-amber-600 text-white'>
          <Link href='/page/customer-service'>Contact our advertising team</Link>
        </Button>
      </div>
    </div>
  )
}
