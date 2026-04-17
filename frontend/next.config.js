/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cho phép load ảnh từ nguồn ngoài (nếu cần)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
