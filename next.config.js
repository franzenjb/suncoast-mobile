/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.nhc.noaa.gov', 'api.weather.gov'],
  },
}

module.exports = nextConfig