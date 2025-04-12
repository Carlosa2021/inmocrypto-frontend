import { createThirdwebClient } from 'thirdweb';

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Opcional para debugging
console.log('Client ID:', process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID);
