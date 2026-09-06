'use client'

import Link from 'next/link'
import { Home, Search, ShoppingCart, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export default function BottomNavigation() {
  const pathname = usePathname()
  const t = useTranslations('Header')

  return (
    <div className='md:hidden fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center p-2 z-50 pb-4'>
      <Link href='/' className={cn('flex flex-col items-center p-2', pathname === '/' ? 'text-primary' : 'text-muted-foreground')}>
        <Home className='h-6 w-6' />
        <span className='text-[10px] mt-1'>{t('Home') || 'Home'}</span>
      </Link>
      <Link href='/search' className={cn('flex flex-col items-center p-2', pathname.startsWith('/search') ? 'text-primary' : 'text-muted-foreground')}>
        <Search className='h-6 w-6' />
        <span className='text-[10px] mt-1'>{t('Search Site') || 'Search'}</span>
      </Link>
      <Link href='/cart' className={cn('flex flex-col items-center p-2', pathname.startsWith('/cart') ? 'text-primary' : 'text-muted-foreground')}>
        <ShoppingCart className='h-6 w-6' />
        <span className='text-[10px] mt-1'>{t('Cart') || 'Cart'}</span>
      </Link>
      <Link href='/account' className={cn('flex flex-col items-center p-2', pathname.startsWith('/account') ? 'text-primary' : 'text-muted-foreground')}>
        <User className='h-6 w-6' />
        <span className='text-[10px] mt-1'>{t('Your account') || 'Account'}</span>
      </Link>
    </div>
  )
}
