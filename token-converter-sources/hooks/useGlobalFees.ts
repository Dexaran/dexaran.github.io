import { useEffect, useMemo } from "react";
import { usePublicClient } from "wagmi";

import useCurrentChainId from "@/hooks/useCurrentChainId";
import { ensureFeeTicker, useFeeTickerStore } from "@/utils/services/feesTicker";

export function useGlobalFees() {
  const chainId = useCurrentChainId();
  const publicClient = usePublicClient({ chainId });

  useEffect(() => {
    if (!chainId || !publicClient) return;
    const unsub = ensureFeeTicker(chainId, publicClient); // ідемпотентно
    return () => unsub?.(); // опційно
  }, [chainId, publicClient]);

  const snap = useFeeTickerStore((s) => (chainId ? s.byChain[chainId] : undefined));

  return useMemo(
    () => ({
      gasPrice: snap?.gasPrice,
      baseFee: snap?.baseFee,
      priorityFee: snap?.priorityFee,
      updatedAtBlock: snap?.updatedAtBlock,
      loading: snap?.loading ?? true,
      error: snap?.error ?? null,
      timestamp: snap?.timestamp,
    }),
    [snap],
  );
}
