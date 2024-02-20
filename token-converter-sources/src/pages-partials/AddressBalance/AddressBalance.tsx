import React, { useCallback } from "react";
import homeStyles from "../../styles/Home.module.scss";
import { useAccount, useNetwork, usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { Icons } from "@/components/atoms/Icons";
import styles from "./AddressBalance.module.scss";
import { List, AutoSizer } from "react-virtualized";
import { ChainToken, loadChainTokens } from "@/components/SelectTokent/SelectTokent";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useCustomTokens } from "./useCustomTokens";
import { TokenCard } from "./TokenCard";
import clsx from "clsx";
import { Address, isAddress } from "viem";
import TokenConverterABI from "../../constants/abi/tokenConverter.json";
import { getConverterContract } from "@/utils/networks";
import { fetchToken } from "@wagmi/core";
import { useIsMobile } from "@/hooks/useIsMobile";
import ERC223ABI from "../../constants/abi/erc223.json";
import { Token } from "./token.type";
import compact from "lodash.compact";

const listHeight = 380;
const listHeightMobile = 500;
const rowHeight = 100;
const rowHeightMobile = 241;

export const AddressBalance = ({ defaultChainId }: { defaultChainId: number }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenNameOrAddress, setTokenNameOrAddress] = useState("");
  const [chainTokens, setChainTokens] = useState([] as ChainToken[]);
  const [searchTokens, setSearchTokens] = useState(chainTokens);

  const isValidTokenAddress = isAddress(tokenNameOrAddress);
  const isValidWalletAddress = isAddress(walletAddress);

  const filterTokensWithSearch = useCallback(() => {
    return chainTokens.filter(
      (token) =>
        token.symbol.toLowerCase().startsWith(tokenNameOrAddress.toLowerCase()) ||
        token.contract.toLowerCase() === tokenNameOrAddress.toLowerCase(),
    );
  }, [chainTokens, tokenNameOrAddress]);

  useEffect(() => {
    if (!tokenNameOrAddress) {
      return setSearchTokens(chainTokens);
    }

    setSearchTokens(filterTokensWithSearch());
  }, [chainTokens, filterTokensWithSearch, tokenNameOrAddress]);

  const { customTokens, addCustomToken, removeCustomToken } = useCustomTokens(
    chain?.id || defaultChainId,
  );

  const publicClient = usePublicClient({ chainId: chain?.id || defaultChainId });
  const converterContractAddress = getConverterContract(chain?.id || defaultChainId);
  const addCustomTokenAddress = useCallback(
    async (address: Address) => {
      //  Is that the default token (is in our configs)?
      const defaultToken = chainTokens.find(
        (token) => token.contract.toLowerCase() === address.toLowerCase(),
      );
      if (defaultToken) {
        addCustomToken({
          tokenAddressERC20: defaultToken.contract,
          symbol: defaultToken.symbol,
          markets: defaultToken.markets,
          decimals: defaultToken.decimals,
          logo: defaultToken.logo,
        });
        setTokenNameOrAddress("");
        return;
      }

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
      let tokenAddressERC20 = undefined as undefined | string;
      let tokenAddressERC223 = undefined as undefined | string;

      if (isERC223Token) {
        tokenAddressERC223 = address;
        // Try to get ERC20 address
        const erc20AddressResult = await publicClient
          .readContract({
            address: converterContractAddress,
            abi: TokenConverterABI,
            functionName: isWrapper ? "getERC20OriginFor" : "getERC20WrapperFor",
            args: [address],
          })
          .catch(() => undefined);
        const erc20Address: Address =
          erc20AddressResult?.[0] === "0x0000000000000000000000000000000000000000"
            ? undefined
            : erc20AddressResult?.[0];
        tokenAddressERC20 = erc20Address;
      } else {
        tokenAddressERC20 = address;
        // Try to get ERC223 address
        const erc223AddressResult = await publicClient
          .readContract({
            address: converterContractAddress,
            abi: TokenConverterABI,
            functionName: isWrapper ? "getERC223OriginFor" : "getERC223WrapperFor",
            args: [address],
          })
          .catch(() => undefined);
        const erc223Address: Address =
          erc223AddressResult?.[0] === "0x0000000000000000000000000000000000000000"
            ? undefined
            : erc223AddressResult?.[0];
        tokenAddressERC223 = erc223Address;
      }
      const tokenData = await fetchToken({
        address: address,
        chainId: chain?.id || defaultChainId,
      });
      addCustomToken({
        tokenAddressERC20: tokenAddressERC20 as any,
        tokenAddressERC223: tokenAddressERC223 as any,
        decimals: tokenData.decimals,
        symbol: tokenData.symbol,
      });
      setTokenNameOrAddress("");
    },
    [
      publicClient,
      converterContractAddress,
      addCustomToken,
      defaultChainId,
      chain?.id,
      chainTokens,
    ],
  );

  const addTokenFromAddressHandler = async () => {
    if (!tokenNameOrAddress || !isValidTokenAddress) return;
    await addCustomTokenAddress(tokenNameOrAddress as any);
  };

  useEffect(() => {
    setWalletAddress(address || "");
  }, [address, setWalletAddress]);

  useEffect(() => {
    (async () => {
      const tokens = await loadChainTokens(chain?.id || defaultChainId);
      setChainTokens(tokens || []);
    })();
  }, [chain?.id, defaultChainId]);

  const { showMessage } = useSnackbar();

  const allTokens: Token[] = [
    ...customTokens,
    ...chainTokens
      // filter by ERC20 address
      .filter(
        (token) => !compact(customTokens.map((t) => t.tokenAddressERC20)).includes(token.contract),
      )
      .map(({ contract, isErc223, ...token }) => ({
        [isErc223 ? "tokenAddressERC223" : "tokenAddressERC20"]: contract,
        ...token,
      })),
  ];
  const isMobile = useIsMobile();

  const renderRow = ({ index, key, style }) => {
    const token = allTokens[index];

    return (
      <div className={styles.listItem} key={key} style={style}>
        <TokenCard
          token={token}
          showMessage={showMessage}
          chainId={chain?.id || defaultChainId}
          address={walletAddress as any}
          isCustom={index < customTokens.length}
          addHandler={(t) => {
            addCustomToken(t);
          }}
          removeHandler={(t) => {
            removeCustomToken(t);
          }}
          isMobile={isMobile}
        />
      </div>
    );
  };

  return (
    <>
      <div className={homeStyles.contentBlockHeader}>
        <h1 className={homeStyles.h1}>View address tokens</h1>
        <p className={homeStyles.description}>
          {`You can view ERC-20 & ERC-223 token balances of any address here. For every ERC-20 token there is a ERC-223 version. You can 'pin' tokens to make them display at the top of the list. You can also add a token by typing its name or copy&paste its address to the "Token name or address" input and clicking the + button - this will add the token to the top of the list. You can start / stop loading balances by clicking the load button. Token balances from the top of the list are loaded first. This page reads token balances directly from token contracts.`}
        </p>
      </div>
      <div className={styles.addTokens}>
        <div className={styles.converterFieldsLabel}>Wallet address</div>
        <div className={clsx(styles.amountInputWrapper, styles.walletAddressInput)}>
          <input
            value={walletAddress}
            onChange={(e) => {
              setWalletAddress(e.target.value);
            }}
            placeholder="Wallet address"
            className={styles.input}
            type="text"
          />
          {walletAddress && !isValidWalletAddress ? (
            <span className={styles.invalidAddressError}>Invalid wallet address</span>
          ) : null}
        </div>
        <div className={styles.converterFieldsLabel}>Token name or address</div>
        <div className={styles.addTokenContainer}>
          <div className={clsx(styles.amountInputWrapper, styles.searchInputWrapper)}>
            <input
              value={tokenNameOrAddress}
              onChange={(e) => {
                setTokenNameOrAddress(e.target.value);
              }}
              placeholder="Token name or address"
              className={clsx(styles.input, styles.searchInput)}
              type="text"
            />
            {tokenNameOrAddress ? (
              <>
                {!searchTokens?.length && !isValidTokenAddress ? (
                  <span className={styles.invalidAddressError}>
                    Invalid token address, verify address matches wallet network
                  </span>
                ) : null}
              </>
            ) : null}
            {searchTokens?.length ? (
              <div className={clsx(styles.searchAutocomplete, styles.styledScrollbar)}>
                {searchTokens.slice(0, 10).map(({ contract, ...token }) => {
                  return (
                    <div
                      key={contract}
                      className={styles.searchAutocompleteItem}
                      onClick={() => {
                        addCustomToken({ ...token, tokenAddressERC20: contract });
                        setTokenNameOrAddress("");
                      }}
                    >
                      <img src={token.logo} width="32px" height="32px" alt={token.symbol} />
                      <span>{token.symbol}</span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
          <button
            className={styles.addTokenButton}
            onClick={addTokenFromAddressHandler}
            disabled={tokenNameOrAddress && !isValidTokenAddress}
          >
            <Icons name="add" />
          </button>
        </div>
      </div>
      <div className={styles.tokensList}>
        <div className={styles.tokensListHeader}>
          <h3>List of tokens</h3>
          <button className={styles.updateButton}>
            <Icons name="update" />
          </button>
        </div>
        <div className={styles.tokensListTableHeader}>
          <span className={styles.tableToken}>Token</span>
          <span className={styles.tableERC20}>ERC-20</span>
          <span className={styles.tableERC223}>ERC-223</span>
          <span className={styles.tableAction}>Action</span>
        </div>
      </div>
      <AutoSizer disableHeight>
        {({ width }) => {
          return (
            <List
              width={width - 2}
              height={isMobile ? listHeightMobile : listHeight}
              rowHeight={isMobile ? rowHeightMobile : rowHeight}
              rowRenderer={renderRow}
              rowCount={allTokens.length}
              overscanRowCount={3}
              className={clsx(styles.list, styles.styledScrollbar)}
              style={{
                paddingBottom: "20px",
              }}
            />
          );
        }}
      </AutoSizer>
    </>
  );
};
