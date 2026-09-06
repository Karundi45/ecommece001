import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Menu from '@/components/shared/header/menu'
import { SellerNav } from './seller-nav'
import { getSetting } from '@/lib/actions/setting.actions'

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { site } = await getSetting()
  return (
    <>
      <div className='flex flex-col'>
        <div className='bg-black text-white'>
          <div className='flex h-16 items-center px-2'>
            <Link href='/'>
              <Image
                src='/icons/logo.svg'
                width={48}
                height={48}
                alt={`${site.name} logo`}
              />
            </Link>
            <span className="ml-4 font-bold text-yellow-500">Seller Portal</span>
            <SellerNav className='mx-6 hidden md:flex' />
            <div className='ml-auto flex items-center space-x-4'>
              <Menu forAdmin={false} />
            </div>
          </div>
          <div>
            <SellerNav className='flex md:hidden px-4 pb-2' />
          </div>
        </div>
        <div className='flex-1 p-4'>{children}</div>
      </div>
    </>
  )
}
