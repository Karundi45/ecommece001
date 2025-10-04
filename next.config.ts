// NOTE: `nextjs-amazona-main` is a bundled sample app included in the repo.
// To avoid Next scanning it as part of the main application's app/ routes
// (which causes type errors and missing-files to be picked up), move or
// ignore that folder. If you want to keep the sample, place it under
// `examples/nextjs-amazona-main` instead.
// The sample folder has been moved out of the app routes to avoid build noise.

import type { NextConfig } from 'next'
import withNextIntl from 'next-intl/plugin'
import path from 'path'

const nextConfig: NextConfig = withNextIntl()({
  /* config options here */
  // Ensure Next's outputFileTracingRoot is set to this project root. When
  // multiple lockfiles exist on the machine Next may infer an incorrect
  // workspace root which breaks module resolution for built-in pages like
  // /_document. Setting this explicitly prevents that.
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
})

export default nextConfig

