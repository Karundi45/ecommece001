import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import SellerRegisterForm from './seller-register-form'

export const metadata: Metadata = {
  title: 'Seller Registration',
}

export default async function SellerRegisterPage(props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) {
  const searchParams = await props.searchParams

  const { callbackUrl } = searchParams

  const session = await auth()
  if (session) {
    if (session.user.role === 'Seller') {
      return redirect('/seller')
    }
    return redirect(callbackUrl || '/')
  }

  return (
    <div className='w-full max-w-md mx-auto mt-10'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Become a Seller</CardTitle>
          <p className="text-sm text-gray-500 mt-2">Create a seller account. Your application will be reviewed by our team.</p>
        </CardHeader>
        <CardContent>
          <SellerRegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
