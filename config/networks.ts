import { avalanche, avalancheFuji } from "viem/chains";
import { Chain } from "viem";

export const SUPPORTED_NETWORKS = {
  mainnet: avalanche,
  testnet: avalancheFuji,
} as const;

export type NetworkType = keyof typeof SUPPORTED_NETWORKS;

export function getNetwork(): Chain {
  const env = process.env.NEXT_PUBLIC_NETWORK as NetworkType;
  return SUPPORTED_NETWORKS[env] || SUPPORTED_NETWORKS.mainnet;
}

export function getExplorerUrl(txHash: string): string {
  const network = getNetwork();
  return `${network.blockExplorers?.default.url}/tx/${txHash}`;
}

export function getAddressUrl(address: string): string {
  const network = getNetwork();
  return `${network.blockExplorers?.default.url}/address/${address}`;
}

export const RPC_URLS = {
  mainnet: [
    "https://api.avax.network/ext/bc/C/rpc",
    "https://avalanche-c-chain-rpc.publicnode.com",
  ],
  testnet: [
    "https://api.avax-test.network/ext/bc/C/rpc",
    "https://avalanche-fuji-c-chain-rpc.publicnode.com",
  ],
} as const;
