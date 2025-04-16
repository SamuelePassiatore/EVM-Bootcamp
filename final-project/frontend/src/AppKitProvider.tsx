import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { wagmiAdapter, projectId } from './config';
import { mainnet, sepolia } from '@reown/appkit/networks';

const queryClient = new QueryClient();

const metadata = {
  name: 'MyDApp',
  description: 'La mia DApp con AppKit',
  url: 'http://localhost:5173',
  icons: ['https://www.cryptologos.cc/logos/bitcoin-btc-logo.png?v=040']
};

createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, sepolia],
  projectId: projectId as string,
  metadata,
  features: {
    analytics: true
  }
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}