import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, sepolia } from "@reown/appkit/networks";
import {
  type SIWECreateMessageArgs,
  createSIWEConfig,
  formatMessage,
} from "@reown/appkit-siwe";
import { getSession, signOut, verifyMessage, getNonce } from "./utils/auth";
import { apiUrl, chains, projectId } from "./constants";

if (!projectId) {
  console.warn(
    "Project ID not defined. AppKit may not function correctly.",
  );
}
if (!apiUrl) {
  console.warn("Missing VITE_API_URL.");
}

export const networks = [mainnet, sepolia];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: projectId as string,
  ssr: false,
});

export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: window.location.host,
    uri: window.location.origin,
    chains: chains.map((chain) => Number(chain)),
    statement: "Please sign with your account",
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),
  signOut,
  getNonce,
  getSession,
  verifyMessage,
});
