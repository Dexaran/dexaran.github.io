import { Address } from "viem";

import { NetworksConfigs } from "@/constants/networks";

export const getNetworkExplorerTxUrl = (chainId: number, txHash: string) => {
  const networkConfig = Object.values(NetworksConfigs).find((config) => config.chainId === chainId);
  if (!networkConfig || !txHash) return "#";
  return networkConfig.explorerTx.replace("{tx}", txHash);
};

export const getNetworkExplorerTokenUrl = (chainId: number, contractAddress: string) => {
  const networkConfig = Object.values(NetworksConfigs).find((config) => config.chainId === chainId);
  if (!networkConfig || !contractAddress) return "#";
  return networkConfig.explorerToken.replace("{contract}", contractAddress);
};

export const getNetworkExplorerAddressUrl = (chainId: number, contractAddress: string) => {
  const networkConfig = Object.values(NetworksConfigs).find((config) => config.chainId === chainId);
  if (!networkConfig || !contractAddress) return "#";
  return networkConfig.explorerAddress.replace("{contract}", contractAddress);
};

export const getConverterContract = (chainId: number) => {
  const networkConfig = Object.values(NetworksConfigs).find((config) => config.chainId === chainId);
  return networkConfig?.converterContract as Address;
};

export const supportedChainIds = Object.values(NetworksConfigs).map((config) => config.chainId);

export const chains = Object.values(NetworksConfigs).map((config) => config.chainConfig);
