// lib/blockTicker.ts
import { watchBlockNumber } from "@wagmi/core";
import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import { DexChainId } from "@/config/networks.config";
import { config } from "@/config/wagmi.config";

type BlockTickerState = {
  lastByChain: Record<number, bigint | undefined>;
  startedByChain: Record<number, boolean>;
  unwatchByChain: Record<number, (() => void) | undefined>;
};

export const useBlockTickerStore = createWithEqualityFn<BlockTickerState>()(
  subscribeWithSelector(() => ({
    lastByChain: {},
    startedByChain: {},
    unwatchByChain: {},
  })),
);

function throttle<T extends (...a: any[]) => void>(fn: T, ms: number): T {
  let last = 0,
    t: any,
    args: any[];
  return function (this: any, ...a: any[]) {
    const now = Date.now();
    args = a;
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    } else {
      clearTimeout(t);
      t = setTimeout(
        () => {
          last = Date.now();
          fn.apply(this, args);
        },
        ms - (now - last),
      );
    }
  } as T;
}

export function ensureBlockTicker(opts?: {
  chainId: DexChainId;
  pollingIntervalMs?: number;
  throttleMs?: number;
}) {
  const chainId = opts?.chainId;
  if (!chainId) return;

  const { startedByChain, unwatchByChain } = useBlockTickerStore.getState();
  if (startedByChain[chainId]) return;

  useBlockTickerStore.setState((s) => ({
    startedByChain: { ...s.startedByChain, [chainId]: true },
  }));

  const emit = throttle((bn?: bigint) => {
    if (typeof bn === "bigint") {
      useBlockTickerStore.setState((s) => ({
        lastByChain: { ...s.lastByChain, [chainId]: bn },
      }));
    }
  }, opts?.throttleMs ?? 1200);

  const unwatch = watchBlockNumber(config, {
    chainId,
    poll: true, // стабільний на HTTP
    emitOnBegin: true,
    pollingInterval: opts?.pollingIntervalMs ?? 4000,
    onBlockNumber: emit,
    onError: (e) => console.error("[blockTicker]", e),
  });

  useBlockTickerStore.setState((s) => ({
    unwatchByChain: { ...s.unwatchByChain, [chainId]: unwatch },
  }));
}

export function stopBlockTicker(chainId: DexChainId) {
  const { unwatchByChain } = useBlockTickerStore.getState();
  unwatchByChain[chainId]?.();
  useBlockTickerStore.setState((s) => ({
    startedByChain: { ...s.startedByChain, [chainId]: false },
    unwatchByChain: { ...s.unwatchByChain, [chainId]: undefined },
    lastByChain: { ...s.lastByChain, [chainId]: undefined },
  }));
}
