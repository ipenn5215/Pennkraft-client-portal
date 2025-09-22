/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  output: 'standalone',
  trailingSlash: true,
}

module.exports = nextConfig