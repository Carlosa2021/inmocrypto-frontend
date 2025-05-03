// next.config.ts

const nextConfig = {
  env: {
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
  },
  images: {
    domains: [
      'ipfscdn.io', // Thirdweb CDN (principal)
      'nftstorage.link', // NFT.Storage (opcional)
      'gateway.pinata.cloud', // Pinata (opcional)
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfscdn.io',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'nftstorage.link',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        pathname: '/ipfs/**',
      },
    ],
  },
};

export default nextConfig;
