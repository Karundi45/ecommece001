'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export function SellerNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const t = useTranslations('Admin')

  const links = [
    {
      title: t('Overview'),
      href: '/seller',
    },
    {
      title: t('Products'),
      href: '/seller/products',
    },
    {
      title: t('Orders'),
      href: '/seller/orders',
    },
  ]
  return (
    <nav
      className={cn(
        'flex items-center flex-wrap overflow-hidden gap-2 md:gap-4',
        className
      )}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname.includes(item.href) ? '' : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
