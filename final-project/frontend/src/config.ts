import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, sepolia } from "@reown/appkit/networks";
import {
  type SIWECreateMessageArgs,
  createSIWEConfig,
  formatMessage,
} from "@reown/appkit-siwe";
import { getSession, verifyMessage } from "./utils/auth";
import { apiUrl, projectId } from "./constants";

if (!projectId) {
  console.warn(
    "Project ID non definito. AppKit potrebbe non funzionare correttamente.",
  );
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
    chains: [1, 2020],
    statement: "Please sign with your account",
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),

  getNonce: async (): Promise<string> => {
    const res = await fetch(apiUrl + "/nonce", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const nonce = await res.text();
    console.log("Nonce:", nonce);
    return nonce;
  },
  getSession,
  verifyMessage,
  signOut: async () => {
    const res = await fetch(apiUrl + "/signout", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return data == "{}";
  },
});
