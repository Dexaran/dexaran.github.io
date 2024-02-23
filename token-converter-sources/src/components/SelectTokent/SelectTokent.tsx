import React, { useCallback, useEffect, useState } from "react";
import Modal from "@/components/atoms/Modal";
import styles from "./SelectTokent.module.scss";
import { Icons } from "../atoms/Icons";
import { useNetwork, usePublicClient, useToken } from "wagmi";
import Checkbox from "../atoms/Checkbox/Checkbox";
import { Address, isAddress } from "viem";
import { List, AutoSizer } from "react-virtualized";
import Balance from "../Balance/Balance";
import TokenConverterABI from "../../constants/abi/tokenConverter.json";
import { getConverterContract } from "@/utils/networks";
import ERC20ABI from "../../constants/abi/erc20.json";
import ERC223ABI from "../../constants/abi/erc223.json";
import { basePath } from "@/constants/build-config/isProd";

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
    const chainTokens = (await import(`../../constants/tokens/${chainId}.json`)).default as ChainToken[];
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
}: {
  amountToConvert: any;
  setAmountToConvert: any;
  tokenAddressERC20: Address | undefined;
  tokenAddressERC223: Address | undefined;
  setTokenAddressERC20: (address: Address | undefined) => void;
  setTokenAddressERC223: (address: Address | undefined) => void;
  tokenBalanceERC20: any;
  tokenBalanceERC223: any;
  defaultChainId: number;
  toERC223: boolean;
  setToERC223: (boolean) => void;
  isCustomToken: boolean;
  setIsCustomToken: (boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [searchText, setSearchText] = useState("");
  const [chainTokens, setChainTokens] = useState([] as ChainToken[]);
  const [filteredTokens, setFilteredTokens] = useState(chainTokens);

  const { chain } = useNetwork();
  const publicClient = usePublicClient({ chainId: chain?.id || defaultChainId });

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

  const converterContractAddress = getConverterContract(chain?.id || defaultChainId);
  const updateTokenAddress = useCallback(
    async (address: Address) => {
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
      setToERC223(!isERC223Token);
      // Check if it is wrapper token
      const isWrapper = await publicClient
        .readContract({
          address: converterContractAddress,
          abi: TokenConverterABI,
          functionName: "isWrapper",
          args: [address],
        })
        .catch(() => false);
      if (isERC223Token) {
        setTokenAddressERC223(address);
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
        setTokenAddressERC20(erc20Address);
      } else {
        setTokenAddressERC20(address);
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
        setTokenAddressERC223(erc223Address);
      }
    },
    [
      publicClient,
      converterContractAddress,
      setToERC223,
      setTokenAddressERC20,
      setTokenAddressERC223,
    ],
  );

  useEffect(() => {
    if (!searchText) {
      return setFilteredTokens(chainTokens);
    }

    setFilteredTokens(filterTokensWithSearch());
  }, [chainTokens, filterTokensWithSearch, searchText]);

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
    address: tokenAddressERC20 || tokenAddressERC223,
    chainId: chain?.id || defaultChainId,
  });

  useEffect(() => {
    if (defaultTokenAddress) {
      updateTokenAddress(defaultTokenAddress);
    }
  }, [defaultTokenAddress, updateTokenAddress]);

  useEffect(() => {
    if (!isCustomToken) {
      if (defaultTokenAddress) {
        updateTokenAddress(defaultTokenAddress);
      }
      setCustomTokenAddress("");
    }
  }, [isCustomToken, updateTokenAddress, setCustomTokenAddress, defaultTokenAddress]);

  const isCustomTokenAddressValid = isAddress(customTokenAddress);
  useEffect(() => {
    if (isCustomTokenAddressValid) {
      updateTokenAddress(customTokenAddress);
    }
  }, [customTokenAddress, updateTokenAddress, isCustomTokenAddressValid]);

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
            <>
              <Balance
                tokenAddressERC20={tokenAddressERC20}
                tokenAddressERC223={tokenAddressERC223}
                tokenBalanceERC20={tokenBalanceERC20}
                tokenBalanceERC223={tokenBalanceERC223}
                logo={selectedToken?.logo}
                defaultChainId={defaultChainId}
                toERC223={toERC223}
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
