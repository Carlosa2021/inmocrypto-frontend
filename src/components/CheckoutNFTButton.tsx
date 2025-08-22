import { CheckoutWidget } from 'thirdweb/react';
import { polygon } from 'thirdweb/chains';
import { client } from '@/lib/thirdweb/client';

type Address = `0x${string}`;

interface CheckoutNFTWidgetProps {
  amount: string;
  tokenAddress: string;
  seller: string;
  theme?: 'light' | 'dark';
}

export function CheckoutNFTWidget({
  amount,
  tokenAddress,
  seller,
  theme = 'light',
}: CheckoutNFTWidgetProps) {
  const safeTokenAddress = tokenAddress as Address;
  const safeSeller = seller as Address;

  return (
    <CheckoutWidget
      client={client}
      chain={polygon}
      amount={amount}
      seller={safeSeller}
      tokenAddress={safeTokenAddress}
      paymentMethods={['crypto', 'card']}
      theme={theme}
      onSuccess={() => {
        // Aquí tu lógica post-pago
      }}
    />
  );
}
