import { DexChainId } from "@/config/networks.config";

export enum ExplorerLinkType {
  ADDRESS,
  TRANSACTION,
  BLOCK,
  GAS_TRACKER,
  TOKEN,
}

const explorerMap: Record<DexChainId, string> = {
  [DexChainId.MAINNET]: "https://etherscan.io",
};

export default function getExplorerLink(
  type: ExplorerLinkType,
  value: string,
  chainId: DexChainId,
) {
  switch (type) {
    case ExplorerLinkType.ADDRESS:
      return `${explorerMap[chainId]}/address/${value}`;
    case ExplorerLinkType.TRANSACTION:
      return `${explorerMap[chainId]}/tx/${value}`;
    case ExplorerLinkType.BLOCK:
      return `${explorerMap[chainId]}/block/${value}`;
    case ExplorerLinkType.TOKEN:
      return `${explorerMap[chainId]}/token/${value}`;
    case ExplorerLinkType.GAS_TRACKER:
      switch (chainId) {
        case DexChainId.MAINNET:
          return `${explorerMap[chainId]}/gastracker`;
        default:
          return `${explorerMap[chainId]}`;
      }

    default:
      return `${explorerMap[chainId]}`;
  }
}
