import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { siweConfig, wagmiAdapter } from "./config";
import { chains, projectId } from "./constants";

const queryClient = new QueryClient();

const metadata = {
  name: "MyDApp",
  description: "La mia DApp con AppKit",
  url: "http://localhost:5173",
  icons: ["https://www.cryptologos.cc/logos/bitcoin-btc-logo.png?v=040"],
};

createAppKit({
  adapters: [wagmiAdapter],
  networks: chains,
  projectId: projectId as string,
  metadata,
  siweConfig,
  features: {
    analytics: true,
  },
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
