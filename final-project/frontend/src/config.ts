import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, sepolia } from '@reown/appkit/networks';

export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

if (!projectId) {
  console.warn('Project ID non definito. AppKit potrebbe non funzionare correttamente.');
}

export const networks = [mainnet, sepolia];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: projectId as string,
  ssr: false
});