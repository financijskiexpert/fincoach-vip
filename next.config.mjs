/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  async headers() {
    return [
      {
        source: '/besplatna-edukacija',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
      {
        source: '/besplatna-edukacija/:slug*',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/besplatna-edukacija',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/besplatna-edukacija/:slug*',
        permanent: true,
      },
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['@resvg/resvg-js'],
  },
}

export default nextConfig
