import React, { useCallback, useEffect, useState } from "react";
import Modal from "@/components/atoms/Modal";
import styles from "./SelectTokent.module.scss";
import { Icons } from "../atoms/Icons";
import { useBlockNumber, useNetwork, usePublicClient, useToken } from "wagmi";
import Checkbox from "../atoms/Checkbox/Checkbox";
import { Address, isAddress } from "viem";
import { List, AutoSizer } from "react-virtualized";
import Balance from "../Balance/Balance";
import TokenConverterABI from "../../constants/abi/tokenConverter.json";
import { getConverterContract } from "@/utils/networks";
import ERC20ABI from "../../constants/abi/erc20.json";
import ERC223ABI from "../../constants/abi/erc223.json";
import { basePath } from "@/constants/build-config/isProd";
import { FetchBalanceResult } from "@wagmi/core";
import { getTokenInfo } from "@/pages-partials/AddressBalance/useCustomTokens";
const listHeight = 380;
const rowHeight = 60;

export type ChainToken = {
  contract: Address;
  symbol: string;
  logo?: string;
  decimals: number;
  markets?: number[];
  isErc223?: boolean;
};

export const loadChainTokens = async (chainId: number): Promise<ChainToken[]> => {
  if (!chainId) return Promise.resolve([]);
  try {
    const chainTokens = (await import(`../../constants/tokens/${chainId}.json`))
      .default as ChainToken[];
    if (chainTokens?.length) {
      return chainTokens;
    } else {
      return Promise.resolve([]);
    }
  } catch (error) {
    return Promise.resolve([]);
  }
};

export default function SelectTokent({
  defaultChainId,
  amountToConvert,
  setAmountToConvert,
  tokenAddressERC20,
  tokenAddressERC223,
  setTokenAddressERC20,
  setTokenAddressERC223,
  tokenBalanceERC20,
  tokenBalanceERC223,
  toERC223,
  setToERC223,
  isCustomToken,
  setIsCustomToken,
  isAddressLoading,
}: {
  amountToConvert: any;
  setAmountToConvert: any;
  tokenAddressERC20: Address | undefined;
  tokenAddressERC223: Address | undefined;
  setTokenAddressERC20: (address: Address | undefined) => void;
  setTokenAddressERC223: (address: Address | undefined) => void;
  tokenBalanceERC20: FetchBalanceResult;
  tokenBalanceERC223: FetchBalanceResult;
  defaultChainId: number;
  toERC223: boolean;
  setToERC223: (boolean) => void;
  isCustomToken: boolean;
  setIsCustomToken: (boolean) => void;
  isAddressLoading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [searchText, setSearchText] = useState("");
  const [chainTokens, setChainTokens] = useState([] as ChainToken[]);
  const [filteredTokens, setFilteredTokens] = useState(chainTokens);

  const { chain } = useNetwork();
  const chainId = chain?.id || defaultChainId;

  const filterTokensWithSearch = useCallback(() => {
    return chainTokens.filter(
      (token) =>
        token.symbol.toLowerCase().startsWith(searchText.toLowerCase()) ||
        token.contract.toLowerCase() === searchText.toLowerCase(),
    );
  }, [chainTokens, searchText]);

  const defaultTokenAddress = chainTokens[0]?.contract;
  const selectedToken = chainTokens.find((token) =>
    [tokenAddressERC20, tokenAddressERC223].includes(token.contract),
  );

  const updateTokenAddress = useCallback(
    (address: Address) => {
      setTokenAddressERC20(address);
      setTokenAddressERC223(undefined);
    },
    [setTokenAddressERC20, setTokenAddressERC223],
  );

  useEffect(() => {
    if (!searchText) {
      return setFilteredTokens(chainTokens);
    }

    setFilteredTokens(filterTokensWithSearch());
  }, [chainTokens, filterTokensWithSearch, searchText]);

  useEffect(() => {
    (async () => {
      const tokens = await loadChainTokens(chainId);
      setChainTokens(tokens || []);
    })();
  }, [chainId]);

  const {
    data: tokenData,
    isError,
    isLoading,
  } = useToken({
    address: tokenAddressERC20 || tokenAddressERC223,
    chainId,
  });

  useEffect(() => {
    if (!isCustomToken && defaultTokenAddress) {
      updateTokenAddress(defaultTokenAddress);
    }
  }, [isCustomToken, updateTokenAddress, defaultTokenAddress]);

  const isCustomTokenAddressValid = isAddress(customTokenAddress);
  useEffect(() => {
    if (isCustomTokenAddressValid) {
      updateTokenAddress(customTokenAddress);
    }
  }, [customTokenAddress, updateTokenAddress, isCustomTokenAddressValid]);

  useEffect(() => {
    if (isCustomTokenAddressValid) {
      setToERC223(customTokenAddress === tokenAddressERC20);
    }
  }, [isCustomTokenAddressValid, customTokenAddress, tokenAddressERC20, setToERC223]);

  const closeModalHandler = () => {
    setSearchText("");
    setIsOpen(false);
  };

  const renderRow = ({ index, key, style }) => {
    const token = filteredTokens[index];
    return (
      <div className={styles.row} key={key} style={style}>
        <div
          key={token.contract}
          className={styles.network}
          onClick={() => {
            updateTokenAddress(token.contract);
            closeModalHandler();
          }}
        >
          <img
            src={token.logo || `${basePath}/token-default.svg`}
            width="32px"
            height="32px"
            alt={token.symbol}
          />
          <span>{token.symbol}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.customContractAddressWrapper}>
        <Checkbox
          checked={isCustomToken}
          id="customContractAddress"
          handleChange={() => {
            setIsCustomToken(!isCustomToken);
            setCustomTokenAddress("");
          }}
        />
        <label className={styles.checkboxLabel} htmlFor="customContractAddress">
          Custom contract address
        </label>
      </div>
      {isCustomToken ? (
        <>
          <div className={styles.converterFieldsLabel}>Contract address</div>
          <div className={styles.converterCustomFields}>
            <div className={styles.amountInputWrapper}>
              <input
                value={customTokenAddress}
                onChange={(e) => {
                  setCustomTokenAddress(e.target.value);
                }}
                placeholder="Contract address"
                className={styles.amountInput}
                type="text"
              />
            </div>
          </div>
          {isCustomTokenAddressValid ? (
            <>
              <Balance
                tokenAddressERC20={tokenAddressERC20}
                tokenAddressERC223={tokenAddressERC223}
                tokenBalanceERC20={tokenBalanceERC20}
                tokenBalanceERC223={tokenBalanceERC223}
                logo={selectedToken?.logo}
                defaultChainId={defaultChainId}
                toERC223={toERC223}
                isAddressLoading={isAddressLoading}
              />
              <div style={{ height: "16px" }} />
            </>
          ) : null}
          <div className={styles.validationError}>
            {!isCustomTokenAddressValid && customTokenAddress ? "Address is not valid" : null}
          </div>
          <div className={styles.converterFieldsLabel}>Number of tokens</div>
          <div className={styles.converterCustomFields}>
            <div className={styles.amountInputWrapper}>
              <input
                value={amountToConvert}
                onChange={(e) => {
                  setAmountToConvert(e.target.value);
                }}
                placeholder="0"
                className={styles.amountInput}
                type="number"
              />
              {isCustomTokenAddressValid ? (
                <button
                  onClick={() => {
                    setAmountToConvert(
                      (toERC223 ? tokenBalanceERC20?.formatted : tokenBalanceERC223?.formatted) ||
                        "",
                    );
                  }}
                  className={styles.maxButton}
                >
                  MAX
                </button>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.converterFieldsLabel}>Token to convert</div>
          <div className={styles.converterFields}>
            <div className={styles.amountInputWrapper}>
              <input
                value={amountToConvert}
                onChange={(e) => {
                  setAmountToConvert(e.target.value);
                }}
                placeholder="0"
                className={styles.amountInput}
                type="number"
              />
              <button
                onClick={() => {
                  setAmountToConvert(
                    (toERC223 ? tokenBalanceERC20?.formatted : tokenBalanceERC223?.formatted) || "",
                  );
                }}
                className={styles.maxButton}
              >
                MAX
              </button>
            </div>
            <button className={styles.pickTokenButton} onClick={() => setIsOpen(true)}>
              <span className={styles.tokenName}>
                <img
                  src={selectedToken?.logo || `${basePath}/token-default.svg`}
                  width="24px"
                  height="24px"
                  alt={tokenData?.name || selectedToken?.symbol}
                />
                {tokenData?.name || selectedToken?.symbol}
              </span>
              <Icons name="chevronDown" fill="#C3D8D5" />
            </button>
          </div>
          <Balance
            tokenAddressERC20={tokenAddressERC20}
            tokenAddressERC223={tokenAddressERC223}
            tokenBalanceERC20={tokenBalanceERC20}
            tokenBalanceERC223={tokenBalanceERC223}
            logo={selectedToken?.logo}
            defaultChainId={defaultChainId}
            toERC223={toERC223}
            isAddressLoading={isAddressLoading}
          />
        </>
      )}
      <Modal
        title="Select a token to convert"
        handleClose={closeModalHandler}
        isOpen={isOpen}
        id="select-token"
      >
        <div className={styles.tokenSearchContainer}>
          <div className={styles.amountInputWrapper}>
            <input
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              placeholder="Name or address"
              className={styles.amountInput}
              type="text"
            />
            <Icons name="search" className={styles.tokenSearchSearchIcon} />
          </div>
        </div>

        <AutoSizer disableHeight>
          {({ width }) => {
            return (
              <List
                width={width - 2}
                height={listHeight}
                rowHeight={rowHeight}
                rowRenderer={renderRow}
                rowCount={filteredTokens.length}
                overscanRowCount={3}
                style={{
                  paddingBottom: "20px",
                }}
              />
            );
          }}
        </AutoSizer>
      </Modal>
    </div>
  );
}
