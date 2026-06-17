import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

export const nextConfig: NextConfig = {
  output: 'export',
  distDir: './dist',
}
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);