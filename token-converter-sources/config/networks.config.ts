import { basePath } from "@/config/build/paths";

export enum DexChainId {
  MAINNET = 1,
}

const getEnumValues = <T extends { [key: string]: any }>(enumObj: T): Array<T[keyof T]> => {
  return Object.values(enumObj).filter((v) => !isNaN(Number(v)));
};

export const DEX_SUPPORTED_CHAINS = getEnumValues(DexChainId);

export const networks: Array<{
  chainId: DexChainId;
  name: string;
  symbol: string;
  logo: string;
}> = [
  {
    chainId: DexChainId.MAINNET,
    name: "Ethereum",
    symbol: "ETH",
    logo: `${basePath}/images/chains/ethereum.svg`,
  },
];
