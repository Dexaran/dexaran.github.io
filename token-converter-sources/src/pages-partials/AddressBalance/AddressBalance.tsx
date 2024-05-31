import React, { useCallback } from "react";
import homeStyles from "../../styles/Home.module.scss";
import { useAccount, useNetwork } from "wagmi";
import { useEffect, useState } from "react";
import { Icons } from "@/components/atoms/Icons";
import styles from "./AddressBalance.module.scss";
import { List, AutoSizer } from "react-virtualized";
import { ChainToken, loadChainTokens } from "@/components/SelectTokent/SelectTokent";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { getTokenInfo, useCustomTokens } from "./useCustomTokens";
import { TokenCard } from "./TokenCard";
import clsx from "clsx";
import { Address, isAddress } from "viem";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Token } from "./token.type";
import compact from "lodash.compact";
import { basePath } from "@/constants/build-config/isProd";

const listHeight = 380;
const listHeightMobile = 500;
const rowHeight = 100;
const rowHeightMobile = 241;

export const AddressBalance = ({ defaultChainId }: { defaultChainId: number }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const chainId = chain?.id || defaultChainId;
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

  const { customTokens, addCustomToken, removeCustomToken } = useCustomTokens(chainId);

  const addCustomTokenAddress = useCallback(
    async (address: Address) => {
      const tokenInfo = await getTokenInfo({ chainId, address });

      addCustomToken({
        tokenAddressERC20: tokenInfo.address0,
        tokenAddressERC223: tokenInfo.address1,
        decimals: tokenInfo.decimals,
        symbol: tokenInfo.symbol,
      });
      setTokenNameOrAddress("");
    },
    [addCustomToken, chainId],
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
      const tokens = await loadChainTokens(chainId);
      setChainTokens(tokens || []);
    })();
  }, [chainId]);

  const { showMessage } = useSnackbar();

  const allTokens: Token[] = [
    ...customTokens,
    // Disable default tokens
    // ...chainTokens
    //   // filter by ERC20 address
    //   .filter(
    //     (token) => !compact(customTokens.map((t) => t.tokenAddressERC20)).includes(token.contract),
    //   )
    //   .map(({ contract, isErc223, ...token }) => ({
    //     [isErc223 ? "tokenAddressERC223" : "tokenAddressERC20"]: contract,
    //     ...token,
    //   })),
  ];
  const isMobile = useIsMobile();

  const renderRow = ({ index, key, style }) => {
    const token = allTokens[index];

    return (
      <div className={styles.listItem} key={key} style={style}>
        <TokenCard
          token={token}
          showMessage={showMessage}
          chainId={chainId}
          walletAddress={walletAddress as Address}
          isCustom={index < customTokens.length}
          addHandler={(t) => {
            addCustomTokenAddress(t.tokenAddressERC20 || t.tokenAddressERC223);
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
                      onClick={() => addCustomTokenAddress(contract)}
                    >
                      <img
                        src={token.logo || `${basePath}/token-default.svg`}
                        width="32px"
                        height="32px"
                        alt={token.symbol}
                      />
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
        </div>
        <div className={styles.tokensListTableHeader}>
          <span className={styles.tableToken}>Token</span>
          <span className={styles.tableERC20}>ERC-20</span>
          <span className={styles.tableERC223}>ERC-223</span>
          <span className={styles.tableAction}>Remove</span>
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
