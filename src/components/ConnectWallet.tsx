'use client';

import { ConnectButton, lightTheme, darkTheme } from 'thirdweb/react';
import { client } from '@/lib/thirdweb/client';

export default function ConnectWallet({ theme }: { theme?: string }) {
  return (
    <div className="p-4">
      <ConnectButton
        client={client}
        theme={theme === 'dark' ? darkTheme() : lightTheme()}
        locale="es_ES"
      />
    </div>
  );
}
