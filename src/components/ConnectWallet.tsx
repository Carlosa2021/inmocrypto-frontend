'use client';

import {
  ConnectButton,
  lightTheme,
  darkTheme,
  type Theme,
} from 'thirdweb/react';
import { client } from '@/lib/thirdweb/client';
import type { LocaleId } from 'thirdweb/react';
import type { Wallet, Account } from 'thirdweb/wallets';

type ThemeMode = 'light' | 'dark';

interface ConnectWalletProps {
  theme?: ThemeMode;
  locale?: LocaleId;
  connectButtonClassName?: string;
  detailsButtonClassName?: string;
  onConnect?: (wallet: Wallet) => void;
  onDisconnect?: (info: { wallet: Wallet; account: Account }) => void;
}

export default function ConnectWallet({
  theme = 'light',
  locale = 'es_ES',
  connectButtonClassName,
  detailsButtonClassName,
  onConnect,
  onDisconnect,
}: ConnectWalletProps) {
  const customDark = darkTheme({
    colors: {
      modalBg: '#22223b',
      accentButtonBg: '#4F46E5',
      primaryText: '#FFFFFF',
    },
    fontFamily: 'var(--font-geist-sans)',
  });

  const customLight = lightTheme({
    colors: {
      modalBg: '#eef1f4',
      accentButtonBg: '#3333ff',
      primaryText: '#111133',
    },
    fontFamily: 'var(--font-geist-sans)',
  });

  const selectedTheme: Theme = theme === 'dark' ? customDark : customLight;

  return (
    <ConnectButton
      client={client}
      theme={selectedTheme}
      locale={locale}
      connectButton={
        connectButtonClassName
          ? { className: connectButtonClassName }
          : undefined
      }
      detailsButton={
        detailsButtonClassName
          ? { className: detailsButtonClassName }
          : undefined
      }
      onConnect={onConnect}
      onDisconnect={onDisconnect}
    />
  );
}
