import type { NextAuthConfig } from 'next-auth'

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [],
  callbacks: {
    authorized({ request, auth }: any) {
      const { pathname } = request.nextUrl

      // Protect admin routes
      if (pathname.match(/\/admin(\/.*)?/)) {
        return !!auth && auth.user?.role === 'Admin'
      }

      // Protect seller routes
      if (pathname.match(/\/seller(\/.*)?/)) {
        return !!auth && auth.user?.role === 'Seller'
      }

      // Protect user routes
      const protectedPaths = [/\/checkout(\/.*)?/, /\/account(\/.*)?/]
      if (protectedPaths.some((p) => p.test(pathname))) {
        return !!auth
      }

      return true
    },
  },
} satisfies NextAuthConfig
