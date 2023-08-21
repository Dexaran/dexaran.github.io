import React, { useCallback, useEffect, useState } from "react";
import Modal from "@/components/Modal";
import styles from "./SelectTokent.module.scss";
import { ConverterIcons } from "../ConverterIcons";
import { useAccount, useNetwork, useToken } from "wagmi";
import Checkbox from "../Checkbox/Checkbox";
import tokens from "./tokens.json";
import { Address, isAddress } from "viem";
import { List } from "react-virtualized";

const listHeight = 460;
const rowHeight = 60;
const rowWidth = 438;

interface Props {
  amountToConvert: any;
  setAmountToConvert: any;
  tokenAddress: any;
  setTokenAddressERC20: any;
  tokenBalanceERC20: any;
  tokenBalanceERC223: any;
}
type Token = {
  contract: Address;
  symbol: string;
  logo: string;
  decimals: number;
  markets: number[];
};
const loadChainTokens = async (chainId: number): Promise<Token[]> => {
  switch (chainId) {
    case 1:
      return (await import("../../../public/tokens/eth.json")).default as Token[];
    case 10:
      return (await import("../../../public/tokens/op.json")).default as Token[];
    case 56:
      return (await import("../../../public/tokens/bsc.json")).default as Token[];
    case 137:
      return (await import("../../../public/tokens/polygon.json")).default as Token[];
    case 820:
      return (await import("../../../public/tokens/clo.json")).default as Token[];
    default:
      return Promise.resolve([]);
  }
};

export default function SelectTokent({
  amountToConvert,
  setAmountToConvert,
  tokenAddress,
  setTokenAddressERC20,
  tokenBalanceERC20,
  tokenBalanceERC223,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomToken, setIsCustomToken] = useState(false);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [searchText, setSearchText] = useState("");
  const [chainTokens, setChainTokens] = useState([] as Token[]);
  const [filteredTokens, setFilteredTokens] = useState(chainTokens);

  const filterTokensWithSearch = useCallback(() => {
    return chainTokens.filter((token) =>
      token.symbol.toLowerCase().startsWith(searchText.toLowerCase()),
    );
  }, [chainTokens, searchText]);

  useEffect(() => {
    if (!searchText) {
      return setFilteredTokens(chainTokens);
    }

    setFilteredTokens(filterTokensWithSearch());
  }, [chainTokens, filterTokensWithSearch, searchText]);

  const { chain } = useNetwork();

  const defaultTokenAddress = chainTokens[0]?.contract;
  const selectedToken = chainTokens.find((token) => token.contract === tokenAddress);

  useEffect(() => {
    (async () => {
      const tokens = await loadChainTokens(chain?.id || 1);
      setChainTokens(tokens || []);
    })();
  }, [chain?.id]);

  const {
    data: tokenData,
    isError,
    isLoading,
  } = useToken({
    address: tokenAddress,
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
            <div className={styles.helperText}>
              Balance: {tokenBalanceERC20?.formatted || 0} {tokenData?.name} (ERC-20) |{" "}
              {tokenBalanceERC223?.formatted || 0} {tokenData?.name} (ERC-223)
            </div>
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
                type="text"
              />
              {isCustomTokenAddressValid ? (
                <button
                  onClick={() => {
                    // TODO: check direction
                    setAmountToConvert(tokenBalanceERC20?.formatted || "");
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
                type="text"
              />
              <button
                onClick={() => {
                  // TODO: check direction
                  setAmountToConvert(tokenBalanceERC20?.formatted || "");
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
              <ConverterIcons name="chevronDown" fill="#C3D8D5" />
            </button>
          </div>
          <div className={styles.helperText}>
            Balance: {tokenBalanceERC20?.formatted || 0} {tokenData?.name || selectedToken?.symbol}{" "}
            (ERC-20) | {tokenBalanceERC223?.formatted || 0}{" "}
            {tokenData?.name || selectedToken?.symbol} (ERC-223)
          </div>
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
            <ConverterIcons name="search" className={styles.tokenSearchSearchIcon} />
          </div>
        </div>

        <List
          width={rowWidth}
          height={listHeight}
          rowHeight={rowHeight}
          rowRenderer={renderRow}
          rowCount={filteredTokens.length}
          overscanRowCount={3}
          style={{
            paddingBottom: "20px",
          }}
        />
      </Modal>
    </div>
  );
}
