/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apollo.olx.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'apollo-singapore.akamaized.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'statics.olx.in',
        port: '',
        pathname: '/**',
      },
      // Agar aur image domains add karne hain
      {
        protocol: 'https',
        hostname: '*.olx.in',  // Wildcard for all OLX subdomains
        port: '',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig
