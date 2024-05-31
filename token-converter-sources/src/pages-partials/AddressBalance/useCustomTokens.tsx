import { useEffect, useState } from "react";
import uniq from "lodash.uniq";
import uniqBy from "lodash.uniqby";
import compact from "lodash.compact";
import { getData, storeData } from "@/utils/local-storage.util";
import { Token } from "./token.type";
import { publicClient as createPublicClient } from "@/pages/_app";
import ERC223ABI from "../../constants/abi/erc223.json";
import { getConverterContract } from "@/utils/networks";
import TokenConverterABI from "../../constants/abi/tokenConverter.json";
import { Address } from "viem";
import { fetchToken } from "@wagmi/core";

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
const filterTokensByUniqAddress = (tokens: Token[]) =>
  filterTokensByErc223Contract(filterTokensByErc20Contract(tokens));

export const useCustomTokens = (chainId: number) => {
  const STORAGE_KEY = `customTokensV2.${chainId}`;
  const [customTokens, setCustomTokens] = useState([] as Token[]);
  const updateCustomTokens = (tokens: Token[]) => {
    setCustomTokens(tokens);
    storeData(STORAGE_KEY, tokens);
  };
  const addCustomToken = (token: Token) => {
    const updatedTokens = filterTokensByUniqAddress(compact([...customTokens, token]));
    updateCustomTokens(updatedTokens);
  };

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

export type TokenInfo = {
  address0?: Address; // ERC20 address
  address1?: Address; // ERC223 address
  decimals: number;
  name: string;
  symbol: string;
};

export const getTokenInfo = async ({ chainId, address }: { chainId: any; address?: Address }) => {
  if (!address || !chainId) return;
  const converterContractAddress = getConverterContract(chainId);
  const publicClient = createPublicClient({ chainId });

  // Read token standard
  const tokenStandard = await publicClient
    .readContract({
      address: address,
      abi: ERC223ABI,
      functionName: "standard",
    })
    .catch(() => "");

  // Check if it is ERC223 token
  const isERC223Token = tokenStandard === "erc223" || tokenStandard === "223";

  // Check if it is wrapper token
  const isWrapper = await publicClient
    .readContract({
      address: converterContractAddress,
      abi: TokenConverterABI,
      functionName: "isWrapper",
      args: [address],
    })
    .catch(() => false);

  let address0 = undefined as Address | undefined;
  let address1 = undefined as Address | undefined;

  if (isERC223Token) {
    address1 = address;
    // Try to get ERC20 address
    address0 = await publicClient
      .readContract({
        address: converterContractAddress,
        abi: TokenConverterABI,
        functionName: isWrapper ? "getERC20OriginFor" : "getERC20WrapperFor",
        args: [address],
      })
      .then((result) => {
        return isWrapper ? result : result?.[0];
      })
      .then((result) => {
        return result === "0x0000000000000000000000000000000000000000" ? undefined : result;
      })
      .catch(() => undefined);
  } else {
    address0 = address;
    // Try to get ERC223 address
    address1 = await publicClient
      .readContract({
        address: converterContractAddress,
        abi: TokenConverterABI,
        functionName: isWrapper ? "getERC223OriginFor" : "getERC223WrapperFor",
        args: [address],
      })
      .then((result) => {
        return isWrapper ? result : result?.[0];
      })
      .then((result) => {
        return result === "0x0000000000000000000000000000000000000000" ? undefined : result;
      })
      .catch(() => undefined);
  }
  const tokenData = await fetchToken({
    address: address,
    chainId: chainId,
  });

  const tokenInfo: TokenInfo = {
    address0,
    address1,
    decimals: tokenData.decimals,
    name: tokenData.name,
    symbol: tokenData.symbol,
  };

  return tokenInfo;
};
