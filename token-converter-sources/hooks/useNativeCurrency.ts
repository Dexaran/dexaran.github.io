import { DexChainId } from "@/config/networks.config";
import useCurrentChainId from "@/hooks/useCurrentChainId";

const nativeCurrenciesMap: Record<DexChainId, { symbol: string; name: string; logoURI: string }> = {
  [DexChainId.MAINNET]: {
    symbol: "ETH",
    name: "Ethereum",
    logoURI: "/images/coins/ETH.svg",
  },
};

export function useNativeCurrency() {
  const chainId = useCurrentChainId();

  return nativeCurrenciesMap[chainId];
}
