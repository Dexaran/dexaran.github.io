import React, { useCallback, useEffect, useState } from "react";
import Modal from "@/components/atoms/Modal";
import styles from "./SelectTokent.module.scss";
import { Icons } from "../atoms/Icons";
import { useAccount, useNetwork, useToken } from "wagmi";
import Checkbox from "../atoms/Checkbox/Checkbox";
import { Address, isAddress } from "viem";
import { List, AutoSizer } from "react-virtualized";
import Balance from "../Balance/Balance";

const listHeight = 380;
const rowHeight = 60;

export type Token = {
  contract: Address;
  symbol: string;
  logo?: string;
  decimals: number;
  markets?: number[];
};

export const loadChainTokens = async (chainId: number): Promise<Token[]> => {
  if (!chainId) return Promise.resolve([]);
  try {
    const chainTokens = (await import(`../../constants/tokens/${chainId}.json`)).default as Token[];
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
  tokenBalanceERC20,
  tokenBalanceERC223,
  toERC223,
}: {
  amountToConvert: any;
  setAmountToConvert: any;
  tokenAddressERC20: any;
  tokenAddressERC223: any;
  setTokenAddressERC20: any;
  tokenBalanceERC20: any;
  tokenBalanceERC223: any;
  defaultChainId: number;
  toERC223: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomToken, setIsCustomToken] = useState(false);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [searchText, setSearchText] = useState("");
  const [chainTokens, setChainTokens] = useState([] as Token[]);
  const [filteredTokens, setFilteredTokens] = useState(chainTokens);

  const filterTokensWithSearch = useCallback(() => {
    return chainTokens.filter(
      (token) =>
        token.symbol.toLowerCase().startsWith(searchText.toLowerCase()) ||
        token.contract.toLowerCase() === searchText.toLowerCase(),
    );
  }, [chainTokens, searchText]);

  useEffect(() => {
    if (!searchText) {
      return setFilteredTokens(chainTokens);
    }

    setFilteredTokens(filterTokensWithSearch());
  }, [chainTokens, filterTokensWithSearch, searchText]);

  const { chain } = useNetwork();
  const { address } = useAccount();

  const defaultTokenAddress = chainTokens[0]?.contract;
  const selectedToken = chainTokens.find((token) => token.contract === tokenAddressERC20);

  useEffect(() => {
    (async () => {
      const tokens = await loadChainTokens(chain?.id || defaultChainId);
      setChainTokens(tokens || []);
    })();
  }, [chain?.id, defaultChainId]);

  const {
    data: tokenData,
    isError,
    isLoading,
  } = useToken({
    address: tokenAddressERC20,
  });

  useEffect(() => {
    setTokenAddressERC20(defaultTokenAddress);
  }, [defaultTokenAddress, setTokenAddressERC20]);

  useEffect(() => {
    if (!isCustomToken) {
      setTokenAddressERC20(defaultTokenAddress);
      setCustomTokenAddress("");
    }
  }, [isCustomToken, setTokenAddressERC20, setCustomTokenAddress, defaultTokenAddress]);

  const isCustomTokenAddressValid = isAddress(customTokenAddress);
  useEffect(() => {
    if (isAddress(customTokenAddress)) {
      setTokenAddressERC20(customTokenAddress);
    }
  }, [customTokenAddress, setTokenAddressERC20]);

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
            setTokenAddressERC20(token.contract);
            closeModalHandler();
          }}
        >
          <img src={token.logo} width="32px" height="32px" alt={token.symbol} />
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
          handleChange={() => setIsCustomToken(!isCustomToken)}
        />
        <label className={styles.checkboxLabel} htmlFor="customContractAddress">
          Custom contract address
        </label>
      </div>
      {isCustomToken ? (
        <>
          <div className={styles.converterFieldsLabel}>Contract address (ERC20)</div>
          <div className={styles.converterCustomFields}>
            <div className={styles.amountInputWrapper}>
              <input
                value={customTokenAddress}
                onChange={(e) => {
                  setCustomTokenAddress(e.target.value);
                }}
                placeholder="Contract address (ERC20)"
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
              />
              <div style={{ height: "16px" }} />
            </>
          ) : (
            <div className={styles.helperText}>Address is not valid</div>
          )}
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
                  src={selectedToken?.logo}
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
