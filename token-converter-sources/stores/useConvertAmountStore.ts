import { create } from "zustand";

interface LiquidityAmountsStore {
  typedValue: string;
  setTypedValue: (data: { typedValue: string }) => void;
  reset: () => void;
}

export const useConvertAmountStore = create<LiquidityAmountsStore>((set, get) => ({
  typedValue: "",
  setTypedValue: ({ typedValue }) => {
    set({
      typedValue,
    });
  },
  reset: () =>
    set({
      typedValue: "",
    }),
}));
