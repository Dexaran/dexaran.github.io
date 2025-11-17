import { useMemo } from "react";
import { useAccount } from "wagmi";

import { DEX_SUPPORTED_CHAINS, DexChainId } from "@/config/networks.config";
import { useConnectWalletStore } from "@/stores/useConnectWalletStore";

export default function useCurrentChainId() {
  const { chainId } = useAccount();
  const { chainToConnect } = useConnectWalletStore();

  return useMemo(() => {
    if (chainId && DEX_SUPPORTED_CHAINS.includes(chainId)) {
      return chainId as DexChainId;
    }

    return chainToConnect;
  }, [chainId, chainToConnect]);
}
