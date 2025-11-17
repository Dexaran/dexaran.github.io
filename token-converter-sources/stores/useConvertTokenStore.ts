import { create } from "zustand";

import { Standard } from "@/config/standard.config";
import { TwoStandardToken } from "@/types/Token";

interface ConvertTokenStore {
  token: TwoStandardToken | undefined;
  setToken: (token: TwoStandardToken | undefined) => void;
  tokenStandard: Standard;
  setTokenStandard: (address: Standard) => void;
  reset: () => void;
  switchStandard: () => void;
}

export const useConvertTokensStore = create<ConvertTokenStore>((set, get) => ({
  token: {
    chainId: 1,
    symbol: "USDT",
    address0: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    address1: "0xB8f0a8FCCB9F1d3d287A35643E93b8A7ee5E6980",
    name: "Tether USD",
    decimals: 6,
    logoURI: "https://etherscan.io/token/images/tethernew_32.svg",
  },
  tokenStandard: Standard.ERC20,

  setToken: (token) => set({ token }),

  setTokenStandard: (tokenStandard) => set({ tokenStandard }),
  switchStandard: () =>
    set({
      tokenStandard: get().tokenStandard === Standard.ERC20 ? Standard.ERC223 : Standard.ERC20,
    }),
  reset: () =>
    set({
      token: undefined,
      tokenStandard: Standard.ERC20,
    }),
}));
