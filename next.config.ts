import type { NextConfig } from 'next';
import { publication } from './src/lib/publication.mjs';
const config: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ...(!publication().indexable ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] : []),
    ] }];
  },
};
export default config;
