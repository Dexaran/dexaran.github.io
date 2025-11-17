import { Address } from "viem";

export type ChainToken = {
  addressERC20: Address;
  addressERC223: Address;
  name: string;
  symbol: string;
  logo?: string;
  decimals: number;
  isErc223?: boolean;
};

export const loadChainTokens = async (chainId: number): Promise<ChainToken[]> => {
  if (!chainId) return Promise.resolve([]);
  try {
    const chainTokens = (await import(`./${chainId}_predicted.json`)).default as ChainToken[];
    if (chainTokens?.length) {
      return chainTokens;
    } else {
      return Promise.resolve([]);
    }
  } catch (error) {
    return Promise.resolve([]);
  }
};
