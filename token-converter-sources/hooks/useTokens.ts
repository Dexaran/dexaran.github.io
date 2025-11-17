import { useEffect } from "react";

import { loadChainTokens } from "@/config/tokens";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import { useAllTokensStore } from "@/stores/useAllTokensStore";
import { TwoStandardToken } from "@/types/Token";
import { IIFE } from "@/utils/IIFE";

export default function useTokens() {
  const { tokens, setTokens } = useAllTokensStore();
  const chainId = useCurrentChainId();

  useEffect(() => {
    IIFE(async () => {
      if (!tokens.length) {
        const tokens = await loadChainTokens(chainId);

        const formatted: TwoStandardToken[] = tokens?.map(
          ({ addressERC20, addressERC223, name, decimals, symbol, logo, isErc223 }) => ({
            address0: addressERC20,
            address1: addressERC223,
            symbol,
            name,
            decimals,
            logoURI: logo,
            chainId,
            isErc223Origin: isErc223,
          }),
        );

        setTokens(formatted || []);
      }
    });
  }, [chainId, setTokens, tokens.length]);

  return tokens;
}
