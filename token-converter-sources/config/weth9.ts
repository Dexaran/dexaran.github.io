import { DexChainId } from "@/config/networks.config";
import { TwoStandardToken } from "@/types/Token";

/**
 * Known WETH9 implementation addresses, used in our implementation of Ether#wrapped
 */

export const wrappedTokens: Record<DexChainId, TwoStandardToken> = {
  [DexChainId.MAINNET]: {
    chainId: DexChainId.MAINNET,
    address0: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    address1: "0x2b29C021e1c6942536C2FEe9B143B5DAD6c67BA4",
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
  },
};
