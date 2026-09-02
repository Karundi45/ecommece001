import type { ReactNode } from 'react'
import type { LayoutProps as NextLayoutProps } from 'next'

declare module 'next' {
  export interface LayoutProps {
    children: ReactNode
  }
}

export type RootLayoutProps = {
  children: ReactNode
}

export type LayoutWithChildren = {
  children: ReactNode
}