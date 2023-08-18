import React, { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import styles from "./SelectTokent.module.scss";
import { ConverterIcons } from "../ConverterIcons";
import { useAccount, useNetwork, useToken } from "wagmi";
import Checkbox from "../Checkbox/Checkbox";
import tokens from "./tokens.json";
import { isAddress } from "viem";

interface Props {
  amountToConvert: any;
  setAmountToConvert: any;
  tokenAddress: any;
  setTokenAddressERC20: any;
  tokenBalanceERC20: any;
  tokenBalanceERC223: any;
}

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

  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();

  const chainTokens = tokens.map((item) => item[chain?.id || "820"]).filter((item) => !!item);
  const defaultTokenAddress = chainTokens[0]?.token_address;
  const selectedToken = chainTokens.find((token) => token.token_address === tokenAddress);

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
                  src={selectedToken?.imgUri}
                  width="24px"
                  height="24px"
                  alt={tokenData?.name || selectedToken?.original_name}
                />
                {tokenData?.name || selectedToken?.original_name}
              </span>
              <ConverterIcons name="chevronDown" fill="#C3D8D5" />
            </button>
          </div>
          <div className={styles.helperText}>
            Balance: {tokenBalanceERC20?.formatted || 0}{" "}
            {tokenData?.name || selectedToken?.original_name} (ERC-20) |{" "}
            {tokenBalanceERC223?.formatted || 0} {tokenData?.name || selectedToken?.original_name}{" "}
            (ERC-223)
          </div>
        </>
      )}

      <Modal title="Select a token to convert" handleClose={() => setIsOpen(false)} isOpen={isOpen}>
        <div className={styles.networksContainer}>
          {chainTokens.map((token) => (
            <div
              key={token.token_address}
              className={styles.network}
              onClick={() => {
                setTokenAddressERC20(token.token_address);
                setIsOpen(false);
              }}
            >
              <img src={token.imgUri} width="32px" height="32px" alt={token.original_name} />
              <span>{token.original_name}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
