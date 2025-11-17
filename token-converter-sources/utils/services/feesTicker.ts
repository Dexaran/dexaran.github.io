import { usePublicClient } from "wagmi";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { DexChainId } from "@/config/networks.config";
import { ensureBlockTicker, useBlockTickerStore } from "@/utils/services/blockTicker";

export type FeeSnapshot = {
  gasPrice?: bigint;
  baseFee?: bigint;
  priorityFee?: bigint;
  updatedAtBlock?: bigint;
  loading?: boolean;
  timestamp?: bigint;
  error?: string | null;
};

type FeeTickerState = {
  byChain: Record<number, FeeSnapshot>;
  inflight: Record<number, Promise<void> | undefined>;
};

export const useFeeTickerStore = create<FeeTickerState>()(
  subscribeWithSelector(() => ({
    byChain: {},
    inflight: {},
  })),
);

/** de-dup: не більше одного фетча одночасно на chainId */
async function fetchFeesOnce(
  chainId: DexChainId,
  blockNumber: bigint,
  client?: ReturnType<typeof usePublicClient>,
) {
  if (!client) return; // якщо немає клієнта – нічого не робимо

  const s = useFeeTickerStore.getState();
  if (s.inflight[chainId]) return s.inflight[chainId]!;

  const p = (async () => {
    useFeeTickerStore.setState((st) => ({
      byChain: {
        ...st.byChain,
        [chainId]: { ...(st.byChain[chainId] || {}), loading: true, error: null },
      },
    }));

    try {
      const [eip1559, gasPrice, block] = await Promise.all([
        client.estimateFeesPerGas().catch(() => undefined as any),
        client.getGasPrice().catch(() => undefined as any),
        client.getBlock({ blockTag: "latest" }).catch(() => undefined as any),
      ]);

      useFeeTickerStore.setState((st) => ({
        byChain: {
          ...st.byChain,
          [chainId]: {
            gasPrice,
            baseFee: eip1559?.maxFeePerGas,
            priorityFee: eip1559?.maxPriorityFeePerGas,
            updatedAtBlock: blockNumber,
            timestamp: block?.timestamp,
            loading: false,
            error: null,
          },
        },
      }));
    } catch (e: any) {
      useFeeTickerStore.setState((st) => ({
        byChain: {
          ...st.byChain,
          [chainId]: {
            ...(st.byChain[chainId] || {}),
            loading: false,
            error: e?.message ?? "fee fetch failed",
          },
        },
      }));
    } finally {
      useFeeTickerStore.setState((st) => ({
        inflight: { ...st.inflight, [chainId]: undefined },
      }));
    }
  })();

  useFeeTickerStore.setState((st) => ({ inflight: { ...st.inflight, [chainId]: p } }));
  return p;
}

export function ensureFeeTicker(chainId: DexChainId, client?: ReturnType<typeof usePublicClient>) {
  if (!client) return;
  ensureBlockTicker({ chainId });

  let prev: bigint | undefined;
  return useBlockTickerStore.subscribe(
    (st) => st.lastByChain[chainId],
    (bn) => {
      if (!bn || bn === prev) return;
      prev = bn;
      void fetchFeesOnce(chainId, bn, client);
    },
    { fireImmediately: true },
  );
}
