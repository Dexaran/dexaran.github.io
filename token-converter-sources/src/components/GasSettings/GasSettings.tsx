import React, { useEffect, useState } from "react";
import styles from "./GasSettings.module.scss";
import { useFeeData, useNetwork, useWalletClient } from "wagmi";
import { formatEther, formatGwei, formatUnits, parseGwei, parseUnits } from "viem";
import { roundValue } from "@/utils/renderAddress";
import { publicClient as createPublicClient } from "@/pages/_app";
import Collapse from "../atoms/Collapse";

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
  address: any;
  abi: any;
  functionName: string;
  args: any[];
}) => {
  const [defaultGasLimit, setDefaultGasLimit] = useState(null as null | string);

  const { chain } = useNetwork();
  const { data: walletClient }: any = useWalletClient();
  const { data: feeData } = useFeeData();

  const defaultGasPrice = feeData?.gasPrice ? formatGwei(feeData.gasPrice) : "0";

  useEffect(() => {
    (async () => {
      try {
        const publicClient = createPublicClient({ chainId: chain.id });
        if (publicClient?.estimateContractGas) {
          const gas = await publicClient.estimateContractGas({
            account: walletClient?.account,
            address,
            abi,
            functionName,
            args,
          });
          setDefaultGasLimit(formatUnits(gas, 0));
        }
      } catch (error) {
        console.log("🚀 ~ error:", error);
        setDefaultGasLimit(null);
      }
    })();
  }, [address, abi, functionName, args, walletClient, chain.id]);

  const finalGasPrice = gasPrice === null ? defaultGasPrice : gasPrice;
  const finalGasLimit = gasLimit === null ? defaultGasLimit : gasLimit;
  const networkFee = parseGwei(finalGasPrice) * parseUnits(finalGasLimit || "0", 0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.networkFee} onClick={() => setIsOpen(!isOpen)}>
          <p>Network fee</p>
          <div>
            <span>{`≈ ${roundValue(+formatEther(networkFee), 8)} ${
              chain.nativeCurrency.symbol
            }`}</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${styles.chevron} ${isOpen ? styles.open : ""}`}
            >
              <path
                d="M11.6641 15.9521C11.8838 15.9521 12.0771 15.8643 12.2441 15.6973L19.0557 8.73633C19.2139 8.57812 19.293 8.38477 19.293 8.15625C19.293 7.70801 18.9502 7.35645 18.4932 7.35645C18.2646 7.35645 18.0713 7.44434 17.9219 7.58496L11.6641 13.9834L5.40625 7.58496C5.25684 7.44434 5.05469 7.35645 4.83496 7.35645C4.37793 7.35645 4.03516 7.70801 4.03516 8.15625C4.03516 8.38477 4.11426 8.57812 4.26367 8.73633L11.084 15.6973C11.2422 15.8643 11.4443 15.9521 11.6641 15.9521Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        <Collapse open={isOpen} style={{ width: "100%" }}>
          <div className={styles.gasSettingsContainer}>
            <div className={styles.inputContainer}>
              <div className={styles.converterFieldsLabel}>Gas Price</div>
              <input
                value={finalGasPrice || ""}
                onChange={(e) => {
                  setGasPrice(e.target.value);
                }}
                placeholder="Gas Price"
                className={styles.amountInput}
                type="number"
              />
            </div>
            <div className={styles.inputContainer}>
              <div className={styles.converterFieldsLabel}>Gas Limit</div>
              <input
                value={finalGasLimit || ""}
                onChange={(e) => {
                  setGasLimit(e.target.value);
                }}
                placeholder="Gas Limit"
                className={styles.amountInput}
                type="number"
              />
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
};
