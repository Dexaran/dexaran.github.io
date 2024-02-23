import { useEffect, useState } from "react";
import uniq from "lodash.uniq";
import uniqBy from "lodash.uniqby";
import compact from "lodash.compact";
import { getData, storeData } from "@/utils/local-storage.util";
import { Token } from "./token.type";

const filterTokensByErc20Contract = (tokens: Token[]) => {
  const tokensWithErc20Contract = tokens.filter((t) => !!t.tokenAddressERC20);
  const tokensWithoutErc20Contract = tokens.filter((t) => !t.tokenAddressERC20);

  const tokensWithUniqErc20Contract = uniqBy(tokensWithErc20Contract, (t) => t.tokenAddressERC20);
  return [...tokensWithoutErc20Contract, ...tokensWithUniqErc20Contract];
};
const filterTokensByErc223Contract = (tokens: Token[]) => {
  const tokensWithErc223Contract = tokens.filter((t) => !!t.tokenAddressERC223);
  const tokensWithoutErc223Contract = tokens.filter((t) => !t.tokenAddressERC223);

  const tokensWithUniqErc223Contract = uniqBy(
    tokensWithErc223Contract,
    (t) => t.tokenAddressERC223,
  );
  return [...tokensWithoutErc223Contract, ...tokensWithUniqErc223Contract];
};
const filterTokensByUniqAddress = (tokens: Token[]) => filterTokensByErc223Contract(filterTokensByErc20Contract(tokens));


export const useCustomTokens = (chainId: number) => {
  const STORAGE_KEY = `customTokensV2.${chainId}`;
  const [customTokens, setCustomTokens] = useState([] as Token[]);
  const updateCustomTokens = (tokens: Token[]) => {
    console.log("🚀 ~ updateCustomTokens ~ tokens:", tokens)
    setCustomTokens(tokens);
    storeData(STORAGE_KEY, tokens);
  };
  const addCustomToken = (token: Token) =>{
    const updatedTokens = filterTokensByUniqAddress(compact([...customTokens, token]))
    updateCustomTokens(updatedTokens);
  }
    
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
