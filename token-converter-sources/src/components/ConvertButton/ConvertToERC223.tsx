import React, { useEffect, useMemo, useState } from "react";
import styles from "./ConvertButton.module.scss";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import TokenConverterABI from "../../constants/abi/tokenConverter.json";
import ERC20ABI from "../../constants/abi/erc20.json";

import { parseEther, parseGwei, parseUnits } from "viem";
import { PrimaryButton } from "../atoms/Button/Button";
import { renderShortHash } from "@/utils/renderAddress";
import { GasSettings } from "../GasSettings/GasSettings";
import TxModal from "./TxModal";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { getConverterContract, getNetworkExplorerTxUrl } from "@/utils/networks";
import { FetchBalanceResult } from "@wagmi/core";

const ToERC223ApproveButton = ({
  amountToConvertBigInt,
  tokenAddressERC20,
  gasPrice,
  gasLimit,
}: {
  amountToConvertBigInt: bigint;
  tokenAddressERC20: any;
  gasPrice: null | string;
  gasLimit: null | string;
}) => {
  const { chain } = useNetwork();

  const {
    writeAsync: writeTokenApprove,
    data,
    isLoading,
  } = useContractWrite<typeof ERC20ABI, "approve", any>({
    address: tokenAddressERC20,
    abi: ERC20ABI,
    functionName: "approve",
    args: [getConverterContract(chain?.id), amountToConvertBigInt],
    gas: gasLimit ? parseUnits(gasLimit, 0) : undefined,
    gasPrice: gasPrice ? parseGwei(gasPrice) : undefined,
  } as any);

  const { showMessage } = useSnackbar();
  const handleTokenApprove = async () => {
    try {
      await writeTokenApprove();
    } catch (error) {
      showMessage(error.details, "error");
    }
  };

  const { isLoading: approving } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <>
      <PrimaryButton onClick={handleTokenApprove} isLoading={isLoading || approving}>
        Approve tokens
      </PrimaryButton>
      {!!approving && !!data?.hash && (
        <div className={styles.waitingApproveTxBlock}>
          <p>
            Waiting for approval. Tx:
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
    </>
  );
};

const ToERC223ConvertButton = ({
  amountToConvertBigInt,
  tokenAddressERC20,
  handleCreateTx,
  isLoading,
}: {
  amountToConvertBigInt: bigint;
  tokenAddressERC20: any;
  handleCreateTx: (txHash: string) => void;
  isLoading: boolean;
}) => {
  const [gasPrice, setGasPrice] = useState(null as null | string);
  const [gasLimit, setGasLimit] = useState(null as null | string);
  const { chain } = useNetwork();

  const { data: isWrapper } = useContractRead({
    address: getConverterContract(chain?.id),
    abi: TokenConverterABI,
    functionName: "isWrapper",
    args: [tokenAddressERC20],
  });

  const {
    writeAsync: writeConvert,
    isLoading: isWriteConvertLoading,
    data,
  } = useContractWrite<typeof TokenConverterABI, "wrapERC20toERC223", any>({
    address: getConverterContract(chain?.id),
    abi: TokenConverterABI,
    functionName: isWrapper ? "unwrapERC20toERC223" : "wrapERC20toERC223",
    args: [tokenAddressERC20, amountToConvertBigInt],
    gas: gasLimit ? parseUnits(gasLimit, 0) : undefined,
    gasPrice: gasPrice ? parseGwei(gasPrice) : undefined,
  });

  const { showMessage } = useSnackbar();
  const handleConvertToERC223 = async () => {
    try {
      await writeConvert();
    } catch (error) {
      showMessage(error.details, "error");
    }
  };

  useEffect(() => {
    if (data?.hash) {
      handleCreateTx(data?.hash);
    }
  }, [data?.hash]);

  return (
    <>
      <GasSettings
        gasPrice={gasPrice}
        setGasPrice={setGasPrice}
        gasLimit={gasLimit}
        setGasLimit={setGasLimit}
        address={getConverterContract(chain?.id)}
        abi={TokenConverterABI}
        functionName={isWrapper ? "unwrapERC20toERC223" : "wrapERC20toERC223"}
        args={[tokenAddressERC20, amountToConvertBigInt]}
      />
      <PrimaryButton
        disabled={!amountToConvertBigInt}
        onClick={handleConvertToERC223}
        isLoading={isWriteConvertLoading || isLoading}
      >
        Convert to ERC-223
      </PrimaryButton>
    </>
  );
};

const TxInfo = ({
  txHash,
  contractAddress,
  handleCloseModal,
}: {
  txHash: string;
  contractAddress?: string;
  handleCloseModal: () => void;
}) => {
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalData, setTxModalData] = useState(
    {} as {
      txHash?: string;
      status?: "success" | "error";
      error?: any;
    },
  );

  const { chain } = useNetwork();
  const {
    data: txData,
    isLoading: txIsLoading,
    status,
    error,
  } = useWaitForTransaction({
    hash: txHash as any,
  });

  useEffect(() => {
    if (txHash && (status === "success" || status === "error")) {
      setIsTxModalOpen(true);
      setTxModalData({
        txHash: txHash,
        status,
        error,
      });
    }
  }, [txHash, error, status]);

  return (
    <>
      {!!txIsLoading && !!txHash && (
        <div className={styles.waitingApproveTxBlock}>
          <p>
            Waiting for transaction confirmation. Tx Hash:
            <a target="_blank" rel="noreferrer" href={getNetworkExplorerTxUrl(chain?.id, txHash)}>
              {renderShortHash(txHash, 10)}
            </a>
          </p>
        </div>
      )}
      <TxModal
        isOpen={isTxModalOpen}
        handleClose={() => {
          setIsTxModalOpen(false);
          setTxModalData({});
          handleCloseModal();
        }}
        txHash={txModalData.txHash}
        error={txModalData.error}
        status={txModalData.status}
        toERC223={true}
        contractAddress={contractAddress}
      />
    </>
  );
};
export const ConvertToERC223 = ({
  amountToConvert,
  tokenBalanceERC20,
  tokenAddressERC20,
  tokenAddressERC223,
}: {
  amountToConvert: string;
  tokenBalanceERC20: FetchBalanceResult;
  tokenAddressERC20: any;
  tokenAddressERC223: any;
}) => {
  const amountToConvertBigInt = parseUnits(amountToConvert, tokenBalanceERC20?.decimals);
  const [waitingTxHash, setWaitingTxHash] = useState(null as null | string);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: allowanceAmount } = useContractRead({
    address: tokenAddressERC20,
    abi: ERC20ABI,
    functionName: "allowance",
    args: [address, getConverterContract(chain?.id)],
    watch: true,
  });
  
  const isEnoughBalance = useMemo(() => {
    if (!tokenBalanceERC20?.formatted) {
      return false;
    }

    return +tokenBalanceERC20.formatted >= +amountToConvert;
  }, [amountToConvert, tokenBalanceERC20?.formatted]);

  // Approve Gas settings
  const [gasPrice, setGasPrice] = useState(null as null | string);
  const [gasLimit, setGasLimit] = useState(null as null | string);

  const showConvertButton =
    amountToConvert &&
    isEnoughBalance &&
    allowanceAmount &&
    amountToConvertBigInt <= (allowanceAmount as bigint);

  const renderActionButton = () => {
    if (!amountToConvert) {
      return <PrimaryButton disabled>Enter amount</PrimaryButton>;
    } else if (!isEnoughBalance) {
      return <PrimaryButton disabled>Insufficient amount</PrimaryButton>;
    } else if (
      !allowanceAmount ||
      (allowanceAmount && amountToConvertBigInt > (allowanceAmount as bigint))
    ) {
      return (
        <ToERC223ApproveButton
          amountToConvertBigInt={amountToConvertBigInt}
          tokenAddressERC20={tokenAddressERC20}
          gasPrice={gasPrice}
          gasLimit={gasLimit}
        />
      );
    } else {
      return (
        <ToERC223ConvertButton
          amountToConvertBigInt={amountToConvertBigInt}
          tokenAddressERC20={tokenAddressERC20}
          handleCreateTx={(txHash) => {
            setWaitingTxHash(txHash);
          }}
          isLoading={!!waitingTxHash}
        />
      );
    }
  };
  return (
    <>
      <div className={styles.actionButtonWrapper}>
        {/* Approve Gas settings */}
        {!showConvertButton && (
          <GasSettings
            gasPrice={gasPrice}
            setGasPrice={setGasPrice}
            gasLimit={gasLimit}
            setGasLimit={setGasLimit}
            address={tokenAddressERC20}
            abi={ERC20ABI}
            functionName="approve"
            args={[getConverterContract(chain?.id), parseEther(amountToConvert)]}
          />
        )}
        {renderActionButton()}
        {waitingTxHash ? (
          <TxInfo
            txHash={waitingTxHash}
            contractAddress={tokenAddressERC223}
            handleCloseModal={() => {
              setWaitingTxHash(null);
            }}
          />
        ) : null}
      </div>
    </>
  );
};
