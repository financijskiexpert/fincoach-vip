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
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/besplatna-edukacija',
        permanent: true,
      },
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['@resvg/resvg-js'],
  },
}

export default nextConfig
