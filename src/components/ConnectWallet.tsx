'use client';

import { ConnectButton } from 'thirdweb/react';
import { client } from '@/lib/thirdweb/client';

export default function ConnectWallet() {
  return (
    <div className="p-4">
      <ConnectButton client={client} />
    </div>
  );
}
