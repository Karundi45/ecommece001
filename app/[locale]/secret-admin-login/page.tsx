import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import AdminSigninForm from './admin-signin-form'

export const metadata: Metadata = {
  title: 'Admin Sign In',
}

export default async function AdminSignInPage(props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) {
  const searchParams = await props.searchParams

  const { callbackUrl = '/admin' } = searchParams

  const session = await auth()
  if (session && session.user.role === 'Admin') {
    return redirect(callbackUrl)
  }

  return (
    <div className='w-full max-w-md mx-auto mt-20'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl text-center text-red-600'>Secure Admin Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <AdminSigninForm />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
