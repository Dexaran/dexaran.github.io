import React, { useEffect, useState } from "react";
import styles from "./GasSettings.module.scss";
import { useAccount, useFeeData, useNetwork, useWalletClient } from "wagmi";
import { formatEther, formatGwei, formatUnits, parseGwei, parseUnits } from "viem";
import { roundValue } from "@/utils/renderAddress";

export const GasSettings = ({
  gasPrice,
  setGasPrice,
  gasLimit,
  setGasLimit,
  address,
  abi,
  functionName,
  args,
}: {
  gasPrice: null | string;
  setGasPrice: any;
  gasLimit: null | string;
  setGasLimit: any;
  address: string;
  abi: any;
  functionName: string;
  args: any[];
}) => {
  const [defaultGasLimit, setDefaultGasLimit] = useState(null as null | string);

  const { chain } = useNetwork();
  const { data: walletClient }: any = useWalletClient();
  const { connector: activeConnector } = useAccount();
  const { data: feeData } = useFeeData();

  const defaultGasPrice = feeData?.gasPrice ? formatGwei(feeData.gasPrice) : "0";

  useEffect(() => {
    (async () => {
      try {
        if (walletClient?.estimateContractGas) {
          const gas = await walletClient.estimateContractGas({
            account: walletClient.account,
            address,
            abi,
            functionName,
            args,
          });
          setDefaultGasLimit(formatUnits(gas, 0));
        }
      } catch (error) {
        setDefaultGasLimit(null);
      }
    })();
  }, [address, abi, functionName, args, walletClient]);

  const finalGasPrice = gasPrice === null ? defaultGasPrice : gasPrice;
  const finalGasLimit = gasLimit === null ? defaultGasLimit : gasLimit;
  const networkFee = parseGwei(finalGasPrice) * parseUnits(finalGasLimit || "0", 0);

  if (activeConnector?.id !== "mock") {
    return null;
  }
  return (
    <>
      <div className={styles.gasSettingsContainer}>
        <div className={styles.inputContainer}>
          <div className={styles.converterFieldsLabel}>Gas Price</div>
          <input
            value={finalGasPrice}
            onChange={(e) => {
              setGasPrice(e.target.value);
            }}
            placeholder="Gas Price"
            className={styles.amountInput}
            type="text"
          />
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.converterFieldsLabel}>Gas Limit</div>
          <input
            value={finalGasLimit}
            onChange={(e) => {
              setGasLimit(e.target.value);
            }}
            placeholder="Gas Limit"
            className={styles.amountInput}
            type="text"
          />
        </div>
      </div>
      <div className={styles.networkFee}>
        <p>Network fee</p>
        <span>{`≈ ${roundValue(+formatEther(networkFee), 8)} ${chain.nativeCurrency.symbol}`}</span>
      </div>
    </>
  );
};
