/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lunaheo.s3.amazonaws.com','cdn.hoanghamobile.com'],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.vercel.com',
        port: '',
        pathname: '/image/upload/**',
      },
    ],
  }
}

module.exports = nextConfig
