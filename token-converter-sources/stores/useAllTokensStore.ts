import { create } from "zustand";

import { TwoStandardToken } from "@/types/Token";

interface AllTokensStore {
  tokens: TwoStandardToken[];
  setTokens: (tokens: TwoStandardToken[]) => void;
}

export const useAllTokensStore = create<AllTokensStore>((set, get) => ({
  tokens: [],
  setTokens: (tokens) => set({ tokens }),
}));
