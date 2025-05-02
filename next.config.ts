// next.config.ts

const nextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
  },
  images: {
    domains: [
      'ipfscdn.io',
      '0034bb8a0404643d26c534ffe3c6b710.ipfscdn.io', // ← tu subdominio exacto
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfscdn.io', // permite cualquier subdominio del CDN de Thirdweb
      },
    ],
  },
};

export default nextConfig;
