// next.config.ts

const nextConfig = {
  env: {
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
  },
  images: {
    domains: [
      'ipfscdn.io', // CDN de Thirdweb
      '0034bb8a0404643d26c534ffe3c6b710.ipfscdn.io', // tu subdominio específico (opcional si remotePatterns se usa bien)
      'ipfs.io', // Gateway público
      'nftstorage.link', // Gateway de NFT.Storage (más rápido)
      'gateway.pinata.cloud', // Alternativo si lo usas
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfscdn.io', // todos los subdominios del CDN de Thirdweb
      },
      {
        protocol: 'https',
        hostname: '**.nftstorage.link', // opcional, si usas este gateway
      },
      {
        protocol: 'https',
        hostname: '**.ipfs.io', // cubre subdominios como ipfs.io/ipfs/... (no es obligatorio si usas solo el dominio)
      },
    ],
  },
};

export default nextConfig;
