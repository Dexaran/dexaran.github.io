import React, { useEffect, useMemo, useState } from "react";
import styles from "./ConvertButton.module.scss";
import { useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import ERC20ABI from "../../constants/abi/erc20.json";
import ERC223ABI from "../../constants/abi/erc223.json";

import { parseEther, parseGwei, parseUnits } from "viem";
import { PrimaryButton } from "../atoms/Button/Button";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { GasSettings } from "../GasSettings/GasSettings";
import TxModal from "./TxModal";
import { renderShortHash } from "@/utils/renderAddress";
import { getConverterContract, getNetworkExplorerTxUrl } from "@/utils/networks";

export const ConvertToERC20 = ({
  amountToConvert,
  tokenBalanceERC223,
  tokenAddressERC20,
  tokenAddressERC223,
}: {
  amountToConvert: any;
  tokenBalanceERC223: any;
  tokenAddressERC20: any;
  tokenAddressERC223: any;
}) => {
  const [gasPrice, setGasPrice] = useState(null as null | string);
  const [gasLimit, setGasLimit] = useState(null as null | string);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalData, setTxModalData] = useState(
    {} as {
      txHash?: string;
      status?: "success" | "error";
      error?: any;
    },
  );
  const { chain } = useNetwork();

  const isEnoughBalance223 = useMemo(() => {
    if (!tokenBalanceERC223?.formatted) {
      return false;
    }

    return +tokenBalanceERC223.formatted >= +amountToConvert;
  }, [amountToConvert, tokenBalanceERC223?.formatted]);

  const {
    writeAsync: convertToERC20,
    isLoading: isWriteConvertLoading,
    data,
  } = useContractWrite<typeof ERC223ABI, "transfer", any>({
    address: tokenAddressERC223,
    abi: ERC223ABI,
    functionName: "transfer",
    args: [getConverterContract(chain?.id), parseEther(amountToConvert)],
    gas: gasLimit ? parseUnits(gasLimit, 0) : undefined,
    gasPrice: gasPrice ? parseGwei(gasPrice) : undefined,
  });

  const { showMessage } = useSnackbar();
  const handleConvertToERC20 = async () => {
    try {
      await convertToERC20();
    } catch (error) {
      showMessage(error.details, "error");
    }
  };

  const {
    data: txData,
    isLoading: txIsLoading,
    status,
    error,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (data?.hash && (status === "success" || status === "error")) {
      setIsTxModalOpen(true);
      setTxModalData({
        txHash: data?.hash,
        status,
        error,
      });
    }
  }, [data?.hash, error, status]);

  return (
    <div className={styles.actionButtonWrapper}>
      <GasSettings
        gasPrice={gasPrice}
        setGasPrice={setGasPrice}
        gasLimit={gasLimit}
        setGasLimit={setGasLimit}
        address={tokenAddressERC20}
        abi={ERC223ABI}
        functionName="transfer"
        args={[getConverterContract(chain?.id), parseEther(amountToConvert)]}
      />
      {!isEnoughBalance223 && <PrimaryButton disabled>Insufficient amount</PrimaryButton>}
      {isEnoughBalance223 && (
        <>
          <PrimaryButton
            disabled={!amountToConvert}
            isLoading={isWriteConvertLoading || txIsLoading}
            onClick={handleConvertToERC20}
          >
            {amountToConvert ? "Convert to ERC-20" : "Enter amount"}
          </PrimaryButton>
        </>
      )}
      {!!txIsLoading && !!data?.hash && (
        <div className={styles.waitingApproveTxBlock}>
          <p>
            Waiting for transaction confirmation. Tx Hash:
            <a
              target="_blank"
              rel="noreferrer"
              href={getNetworkExplorerTxUrl(chain?.id, data.hash)}
            >
              {renderShortHash(data.hash, 10)}
            </a>
          </p>
        </div>
      )}
      <TxModal
        isOpen={isTxModalOpen}
        handleClose={() => {
          setIsTxModalOpen(false);
          setTxModalData({});
        }}
        txHash={txModalData.txHash}
        error={txModalData.error}
        status={txModalData.status}
        toERC223={false}
        contractAddress={tokenAddressERC20}
      />
    </div>
  );
};
