import { DexChainId } from "@/config/networks.config";

export const eip1559SupportMap: Record<DexChainId, boolean> = {
  [DexChainId.MAINNET]: true,
};

export function isEip1559Supported(chainId: DexChainId) {
  return eip1559SupportMap[chainId];
}
