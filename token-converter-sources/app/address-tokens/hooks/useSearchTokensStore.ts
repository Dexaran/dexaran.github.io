"use client";

import { Address } from "viem";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { TwoStandardToken } from "@/types/Token";

interface State {
  searchTokens: TwoStandardToken[];

  addToken: (token: TwoStandardToken) => void;
  removeToken: (address: Address) => void;
  reset: () => void;
}

export const useSearchTokensStore = create<State>()(
  persist(
    (set, get) => ({
      searchTokens: [],

      addToken: (token) => {
        const exists = get().searchTokens.some(
          (t) => t.address0.toLowerCase() === token.address0.toLowerCase(),
        );

        if (!exists) {
          set({
            searchTokens: [token, ...get().searchTokens],
          });
        }
      },

      removeToken: (address) => {
        set({
          searchTokens: get().searchTokens.filter(
            (t) => t.address0.toLowerCase() !== address.toLowerCase(),
          ),
        });
      },

      reset: () => set({ searchTokens: [] }),
    }),
    {
      name: "search-tokens-store", // ключ у localStorage
    },
  ),
);
