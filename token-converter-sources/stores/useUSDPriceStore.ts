import { create } from "zustand";

interface USDPriceStore {
  prices: Record<string, number | undefined>;
  loading: Record<string, boolean>;
  setPrice: (token: string, price: number) => void;
  setPrices: (prices: Record<string, number> | undefined) => void;
  setLoading: (token: string, isLoading: boolean) => void;
  isInitialized: boolean;
  setInitialized: () => void;
}

export const useUSDPriceStore = create<USDPriceStore>((set, get) => ({
  prices: {}, // Object to store prices { token: price }
  loading: {}, // Object to track loading state { token: boolean }
  isInitialized: false,
  setPrice: (token, price) => set((state) => ({ prices: { ...state.prices, [token]: price } })),
  setPrices: (prices: Record<string, number> | undefined) =>
    set((state) => ({ prices: { ...state.prices, ...prices } })),
  setInitialized: () => set({ isInitialized: true }),
  setLoading: (token, isLoading) =>
    set((state) => ({ loading: { ...state.loading, [token]: isLoading } })),
}));
