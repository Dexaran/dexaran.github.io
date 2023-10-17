import React, { useCallback } from "react";
import homeStyles from "../../styles/Home.module.scss";
import { useAccount, useContractRead, useNetwork, useToken } from "wagmi";
import { useEffect, useState } from "react";
import { Icons } from "@/components/atoms/Icons";
import styles from "./AddressBalance.module.scss";
import { List, AutoSizer } from "react-virtualized";
import { Token, loadChainTokens } from "@/components/SelectTokent/SelectTokent";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useCustomTokens } from "./useCustomTokens";
import { TokenCard } from "./TokenCard";
import clsx from "clsx";
import { isAddress } from "viem";
import TokenConverterABI from "../../constants/abi/tokenConverter.json";
import { getConverterContract } from "@/utils/networks";
import { fetchToken } from '@wagmi/core'
import { useIsMobile } from "@/hooks/useIsMobile";

const listHeight = 380;
const listHeightMobile = 500;
const rowHeight = 100;
const rowHeightMobile = 241;

export const AddressBalance = ({ defaultChainId }: { defaultChainId: number }) => {
  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenNameOrAddress, setTokenNameOrAddress] = useState("");
  const [chainTokens, setChainTokens] = useState([] as Token[]);
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

  const { data: tokenNameOrAddressERC20 } = useContractRead({
    address: getConverterContract(chain?.id || defaultChainId),
    abi: TokenConverterABI,
    functionName: "getOriginFor",
    args: [tokenNameOrAddress],
  });

  const { data: tokenNameOrAddressERC223 } = useContractRead({
    address: getConverterContract(chain?.id || defaultChainId),
    abi: TokenConverterABI,
    functionName: "getWrapperFor",
    args: [tokenNameOrAddress],
  });

  const addTokenFromAddressHandler = async () => {
    if (!tokenNameOrAddress || !isValidTokenAddress) return;

    // 1. Is that the default token (is in our configs)?
    const defaultToken = chainTokens.find(
      (token) => token.contract.toLowerCase() === tokenNameOrAddress.toLowerCase(),
    );
    if (defaultToken) {
      addCustomToken(defaultToken);
      setTokenNameOrAddress("");
      return;
    }
    // 2. This is a ERC20 contract for an token that is deployed in a converter?
    if (
      tokenNameOrAddressERC223 &&
      tokenNameOrAddressERC223 !== "0x0000000000000000000000000000000000000000"
    ) {
      const tokenData = await fetchToken({
        address: tokenNameOrAddress as any,
        chainId: chain?.id || defaultChainId,
      })
      addCustomToken({
        contract: tokenData.address,
        decimals: tokenData.decimals,
        symbol: tokenData.symbol,
      });
      setTokenNameOrAddress("");
      return;
    }
    // 3. This is a ERC223 contract for an token that is deployed in a converter?
    if (
      tokenNameOrAddressERC20 &&
      tokenNameOrAddressERC20 !== "0x0000000000000000000000000000000000000000"
    ) {
      const tokenData = await fetchToken({
        address: tokenNameOrAddressERC20 as any,
        chainId: chain?.id || defaultChainId,
      })
      addCustomToken({
        contract: tokenData.address,
        decimals: tokenData.decimals,
        symbol: tokenData.symbol,
      });
      setTokenNameOrAddress("");
      return;
    }
    // 4. Ok, its normal ERC20 contract
    const tokenData = await fetchToken({
      address: tokenNameOrAddress as any,
      chainId: chain?.id || defaultChainId,
    })
    addCustomToken({
      contract: tokenData.address,
      decimals: tokenData.decimals,
      symbol: tokenData.symbol,
    });
    setTokenNameOrAddress("");
    return;
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

  const allTokens = [
    ...customTokens,
    ...chainTokens.filter((token) => !customTokens.map((t) => t.contract).includes(token.contract)),
  ];
  const isMobile = useIsMobile();

  const renderRow = ({ index, key, style }) => {
    const token = allTokens[index];

    return (
      <div className={styles.listItem} key={key} style={style}>
        <TokenCard
          token={token}
          showMessage={showMessage}
          chainId={chain?.id}
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
          {`Here, you have the power to explore tokens for any address you desire. But that's not all — we give you the freedom to curate your own list of favorite tokens for easy tracking. Discover, customize, and stay in control.`}
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
          {!isValidWalletAddress ? (
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
                {searchTokens.slice(0, 10).map((token) => {
                  return (
                    <div
                      key={token.contract}
                      className={styles.searchAutocompleteItem}
                      onClick={() => {
                        addCustomToken(token);
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
