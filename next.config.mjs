/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'vercel-blob.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'i.imgur.com',
      'imgur.com',
      'picsum.photos',
      'loremflickr.com',
      'cloudflare-ipfs.com',
      'placeimg.com',
      'placekitten.com',
      'dummyimage.com',
      'res.cloudinary.com'
    ],
    unoptimized: true,
  },
}

export default nextConfig
