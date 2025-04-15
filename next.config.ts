const nextConfig = {
  env: {
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
  },
  images: {
    // Añade el dominio completo que thirdweb usa internamente
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfscdn.io', // acepta todos los subdominios del gateway de thirdweb
      },
    ],
  },
};

export default nextConfig;
