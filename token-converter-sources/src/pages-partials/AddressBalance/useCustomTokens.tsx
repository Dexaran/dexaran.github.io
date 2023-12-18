import { useEffect, useState } from "react";
import uniq from "lodash.uniq";
import compact from "lodash.compact";
import { getData, storeData } from "@/utils/local-storage.util";
import { Token } from "./token.type";

export const useCustomTokens = (chainId: number) => {
  const STORAGE_KEY = `customTokens.${chainId}`;
  const [customTokens, setCustomTokens] = useState([] as Token[]);
  const updateCustomTokens = (tokens: Token[]) => {
    setCustomTokens(tokens);
    storeData(STORAGE_KEY, tokens);
  };
  const addCustomToken = (token: Token) =>
    updateCustomTokens(uniq(compact([...customTokens, token])));
  const removeCustomToken = (token: Token) =>
    updateCustomTokens(
      uniq(
        compact(
          customTokens.filter((t) => {
            if (!!t.tokenAddressERC20 && !!token.tokenAddressERC20) {
              return t.tokenAddressERC20 !== token.tokenAddressERC20;
            } else if (!!t.tokenAddressERC223 && !!token.tokenAddressERC223) {
              return t.tokenAddressERC223 !== token.tokenAddressERC223;
            }
            return true;
          }),
        ),
      ),
    );

  useEffect(() => {
    const savedCustomTokens = getData(STORAGE_KEY);
    setCustomTokens(savedCustomTokens || []);
  }, [STORAGE_KEY]);

  return {
    customTokens,
    addCustomToken,
    removeCustomToken,
  };
};
