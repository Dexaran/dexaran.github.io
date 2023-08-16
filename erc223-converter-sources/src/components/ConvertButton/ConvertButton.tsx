import React, { useMemo } from "react";
import styles from "./ConvertButton.module.scss";
import {  useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import TokenConverterABI from "../../constants/abi/tokenConverter.json";
import ERC20ABI from "../../constants/abi/erc20.json";
import ERC223ABI from "../../constants/abi/erc223.json";

import { formatEther, parseEther } from "viem";

const CLO_CONVERTER_CONTRACT_ADDRESS = "0xc676e76573267cc2E053BE8637Ba71d6BA321195";

export const ConvertToERC223 = ({ 
  amountToConvert,
  tokenBalanceERC20,
  tokenAddress,
}: {
  amountToConvert: any,
  tokenBalanceERC20: any,
  tokenAddress: any,

}) => {
  const { address } = useAccount();

  const {data: readData} = useContractRead({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: "allowance",
    args: [
      address,
      CLO_CONVERTER_CONTRACT_ADDRESS
    ],
    watch: true
  });

  const isEnoughBalance = useMemo(() => {
    if (!tokenBalanceERC20?.formatted) {
      return false;
    }

    return +tokenBalanceERC20.formatted >= +amountToConvert;
  }, [amountToConvert, tokenBalanceERC20?.formatted]);

  const {config: allowanceConfig} = usePrepareContractWrite({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: "approve",
    args: [
      CLO_CONVERTER_CONTRACT_ADDRESS,
      parseEther(amountToConvert)
    ]
  });

  const {write: writeTokenApprove, data: allowanceData} = useContractWrite(allowanceConfig);

  const {data: approvingData, isLoading: approving} = useWaitForTransaction({
    hash: allowanceData?.hash
  })

  const {config, data: configData} = usePrepareContractWrite({
    address: CLO_CONVERTER_CONTRACT_ADDRESS,
    abi: TokenConverterABI,
    functionName: 'convertERC20toERC223',
    args: [
      tokenAddress,
      parseEther(amountToConvert)
    ],
  });

  const {write: writeConvert} = useContractWrite(config);

  return (
    <div className={styles.actionButtonWrapper}>
      {!isEnoughBalance && <button disabled className={styles.convertButton}>Insufficient amount</button>}
      {isEnoughBalance && !readData &&
      <button onClick={writeTokenApprove} className={styles.convertButton}>Approve test tokens</button>}
      {isEnoughBalance && readData && +amountToConvert > +formatEther(readData as any) &&
      <button onClick={writeTokenApprove} className={styles.convertButton}>Approve test tokens</button>}
      {isEnoughBalance && readData && +amountToConvert <= +formatEther(readData as any) &&
      <button disabled={!amountToConvert} onClick={writeConvert} className={styles.convertButton}>
        {amountToConvert ? "Convert to ERC-223" : "Enter amount"}
      </button>}
    </div>
  )
}

export const ConvertToERC20 = ({ 
  amountToConvert,
  tokenBalanceERC223,
  tokenAddressERC223,
}: {
  amountToConvert: any,
  tokenBalanceERC223: any,
  tokenAddressERC223: any,
}) => {
  const isEnoughBalance223 = useMemo(() => {
    if (!tokenBalanceERC223?.formatted) {
      return false;
    }

    return +tokenBalanceERC223.formatted >= +amountToConvert;
  }, [amountToConvert, tokenBalanceERC223?.formatted]);

  const { config } = usePrepareContractWrite({
    address: tokenAddressERC223,
    abi: ERC223ABI,
    functionName: 'transfer',
    args: [
      CLO_CONVERTER_CONTRACT_ADDRESS,
      parseEther(amountToConvert)
    ],
  });

  const {write: convertToERC20} = useContractWrite(config);

  return (
    <div className={styles.actionButtonWrapper}>
      {!isEnoughBalance223 && <button disabled className={styles.convertButton}>Insufficient amount</button>}
      {isEnoughBalance223 &&
      <button disabled={!amountToConvert} onClick={convertToERC20} className={styles.convertButton}>
        {amountToConvert ? "Convert to ERC-20" : "Enter amount"}
      </button>}
      {/* <button onClick={() => test_custom_send_erc20_transaction({})} className={styles.convertButton}>
        CUSTOM ERC20 SEND
      </button>
      <button onClick={() => test_custom_send_erc223_transaction({})} className={styles.convertButton}>
        CUSTOM ERC223 SEND
      </button> */}
    </div>
  )
}
