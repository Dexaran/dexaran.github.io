import { useEffect, useState } from "react";
import { Token } from "@/components/SelectTokent/SelectTokent";
import uniq from "lodash.uniq";
import compact from "lodash.compact";
import { getData, storeData } from "@/utils/local-storage.util";

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
    updateCustomTokens(uniq(compact(customTokens.filter((t) => t.contract !== token.contract))));

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
