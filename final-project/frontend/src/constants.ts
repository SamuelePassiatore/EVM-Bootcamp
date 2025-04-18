import { AppKitNetwork, mainnet, sepolia } from "@reown/appkit/networks";

export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;
export const apiUrl = import.meta.env.API_URL;
export const chains: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, sepolia];
