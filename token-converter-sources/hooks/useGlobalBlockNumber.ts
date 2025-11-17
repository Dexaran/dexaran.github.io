import { useEffect } from "react";
import { shallow } from "zustand/shallow";

import useCurrentChainId from "@/hooks/useCurrentChainId";
import { ensureBlockTicker, useBlockTickerStore } from "@/utils/services/blockTicker";

export function useGlobalBlockNumber(opts?: {
  enabled?: boolean;
  pollingIntervalMs?: number;
  throttleMs?: number;
}) {
  const chainId = useCurrentChainId();
  const enabled = opts?.enabled ?? true;

  useEffect(() => {
    if (enabled && chainId) {
      ensureBlockTicker({
        chainId,
        pollingIntervalMs: opts?.pollingIntervalMs,
        throttleMs: opts?.throttleMs,
      });
    }
  }, [enabled, chainId, opts?.pollingIntervalMs, opts?.throttleMs]);

  const blockNumber = useBlockTickerStore(
    (s) => (chainId ? s.lastByChain[chainId] : undefined),
    shallow,
  );

  return { blockNumber, isReady: typeof blockNumber === "bigint" };
}
