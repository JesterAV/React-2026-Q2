import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

export const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'supernatural-api.onrender.com'
      }
    ]
  }
}
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);