import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Seller Dashboard',
}

const SellerDashboardPage = async () => {
  const session = await auth()

  if (session?.user.role !== 'Seller') {
    redirect('/sign-in')
  }

  if (!session?.user.isSellerApproved) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-600">Application Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your seller account is currently under review by our administrators.</p>
            <p className="mt-2">You will be able to list products and manage orders once approved.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
      <p>Welcome to your seller dashboard. Here you can manage your products and orders.</p>
      {/* We can add Seller-specific overview components here later */}
    </div>
  )
}

export default SellerDashboardPage
