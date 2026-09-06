import { Metadata } from 'next'
import ProductList from './product-list'
import { auth } from '@/auth'

export const metadata: Metadata = {
  title: 'Seller Products',
}

export default async function SellerProduct() {
  const session = await auth()
  return <ProductList sellerId={session?.user.id} />
}
