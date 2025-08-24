/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === 'production' ? '/suncoast-mobile' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/suncoast-mobile/' : '',
  images: {
    unoptimized: true,
    domains: ['www.nhc.noaa.gov', 'api.weather.gov'],
  },
}

module.exports = nextConfig