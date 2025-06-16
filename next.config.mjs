/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ['res.cloudinary.com'],  
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dxlmwq61j/image/upload/v1748111125/uploads',
      },
    ],
  },
};

export default nextConfig;
