import React, { useEffect, useMemo, useState } from "react";
import styles from "./ConvertButton.module.scss";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import TokenConverterABI from "../../constants/abi/tokenConverter.json";
import ERC20ABI from "../../constants/abi/erc20.json";
import ERC223ABI from "../../constants/abi/erc223.json";

import { formatEther, parseEther } from "viem";
import { PrimaryButton } from "../Button/Button";
import Modal from "../Modal";
import { ConverterIcons } from "../ConverterIcons";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { renderShortAddress, renderShortHash } from "@/utils/renderAddress";
import { CLO_CONVERTER_CONTRACT_ADDRESS } from "@/pages";

export default function SuccessfullModal({
  isOpen,
  handleClose,
  toERC223,
  txHash,
  contractAddress,
}: {
  isOpen: boolean;
  handleClose: any;
  toERC223: boolean;
  txHash?:string;
  contractAddress?: string;
}) {
  const {showMessage} = useSnackbar();

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} large>
      <div className={styles.successfullModalContainer}>
        <ConverterIcons name="success" size="120px" />

        <p className={styles.successfullModalTitle}>{`Tokens successfully converted to ${
          toERC223 ? "ERC-223" : "ERC-20"
        }`}</p>
        <p className={styles.successfullModalDescription}>Tokens are delivered to your address.</p>
        <div className={styles.successfullModalTx}>
          <p>Transaction</p>
          <span onClick={async () => {
            await navigator.clipboard.writeText(txHash);
            showMessage("Transaction hash copied");
          }}>{renderShortHash(txHash, 10)}</span>
        </div>
        <div className={styles.successfullModalContract}>
          <p>{`${toERC223 ? "ERC-223" : "ERC-20"} token contract`}</p>
          <span onClick={async () => {
            await navigator.clipboard.writeText(contractAddress);
            showMessage("Contract address copied");
          }}>{renderShortAddress(contractAddress, 10)}</span>
        </div>
        <PrimaryButton onClick={handleClose} style={{ marginTop: "20px" }}>Done</PrimaryButton>
      </div>
    </Modal>
  );
}

export const ConvertToERC223 = ({
  amountToConvert,
  tokenBalanceERC20,
  tokenAddressERC20,
  tokenAddressERC223,
}: {
  amountToConvert: any;
  tokenBalanceERC20: any;
  tokenAddressERC20: any;
  tokenAddressERC223: any;
}) => {
  const [isSuccessfullModalOpen, setIsSuccessfullModalOpen] = useState(false);
  const { address } = useAccount();

  const { data: readData } = useContractRead({
    address: tokenAddressERC20,
    abi: ERC20ABI,
    functionName: "allowance",
    args: [address, CLO_CONVERTER_CONTRACT_ADDRESS],
    watch: true,
  });

  const isEnoughBalance = useMemo(() => {
    if (!tokenBalanceERC20?.formatted) {
      return false;
    }

    return +tokenBalanceERC20.formatted >= +amountToConvert;
  }, [amountToConvert, tokenBalanceERC20?.formatted]);

  const { config: allowanceConfig } = usePrepareContractWrite({
    address: tokenAddressERC20,
    abi: ERC20ABI,
    functionName: "approve",
    args: [CLO_CONVERTER_CONTRACT_ADDRESS, parseEther(amountToConvert)],
  });

  const { write: writeTokenApprove, data: allowanceData } = useContractWrite(allowanceConfig);

  const { data: approvingData, isLoading: approving } = useWaitForTransaction({
    hash: allowanceData?.hash,
  });

  const { config, data: configData } = usePrepareContractWrite({
    address: CLO_CONVERTER_CONTRACT_ADDRESS,
    abi: TokenConverterABI,
    functionName: "convertERC20toERC223",
    args: [tokenAddressERC20, parseEther(amountToConvert)],
  });

  const {
    write: writeConvert,
    isLoading: isWriteConvertLoading,
    data: writeConvertData,
  } = useContractWrite(config);
  const { data: convertTxData, isLoading: convertLoading } = useWaitForTransaction({
    hash: writeConvertData?.hash,
  });

  useEffect(() => {
    if (writeConvertData?.hash) {
      setIsSuccessfullModalOpen(true);
    }
  }, [writeConvertData?.hash]);

  return (
    <div className={styles.actionButtonWrapper}>
      {!isEnoughBalance && (
        <PrimaryButton disabled>
          Insufficient amount
        </PrimaryButton>
      )}
      {isEnoughBalance &&
        (!readData || (readData && +amountToConvert > +formatEther(readData as any))) && (
          <PrimaryButton onClick={writeTokenApprove} isLoading={approving}>
            Approve test tokens
          </PrimaryButton>
        )}
      {isEnoughBalance && readData && +amountToConvert <= +formatEther(readData as any) && (
        <PrimaryButton
          disabled={!amountToConvert}
          onClick={writeConvert}
          isLoading={isWriteConvertLoading}
        >
          {amountToConvert ? "Convert to ERC-223" : "Enter amount"}
        </PrimaryButton>
      )}
      <SuccessfullModal
        isOpen={isSuccessfullModalOpen}
        handleClose={() => {
          setIsSuccessfullModalOpen(false);
        }}
        txHash={writeConvertData?.hash}
        toERC223={true}
        contractAddress={tokenAddressERC223}
      />
    </div>
  );
};

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
  const [isSuccessfullModalOpen, setIsSuccessfullModalOpen] = useState(false);

  const isEnoughBalance223 = useMemo(() => {
    if (!tokenBalanceERC223?.formatted) {
      return false;
    }

    return +tokenBalanceERC223.formatted >= +amountToConvert;
  }, [amountToConvert, tokenBalanceERC223?.formatted]);

  const { config } = usePrepareContractWrite({
    address: tokenAddressERC223,
    abi: ERC223ABI,
    functionName: "transfer",
    args: [CLO_CONVERTER_CONTRACT_ADDRESS, parseEther(amountToConvert)],
  });

  const {
    write: convertToERC20,
    isLoading: isWriteConvertLoading,
    data: writeConvertData,
  } = useContractWrite(config);

  useEffect(() => {
    if (writeConvertData?.hash) {
      setIsSuccessfullModalOpen(true);
    }
  }, [writeConvertData?.hash]);

  return (
    <div className={styles.actionButtonWrapper}>
      {!isEnoughBalance223 && <PrimaryButton disabled>Insufficient amount</PrimaryButton>}
      {isEnoughBalance223 && (
        <PrimaryButton
          disabled={!amountToConvert}
          isLoading={isWriteConvertLoading}
          onClick={convertToERC20}
        >
          {amountToConvert ? "Convert to ERC-20" : "Enter amount"}
        </PrimaryButton>
      )}
      <SuccessfullModal
        isOpen={isSuccessfullModalOpen}
        handleClose={() => {
          setIsSuccessfullModalOpen(false);
        }}
        txHash={writeConvertData?.hash}
        toERC223={false}
        contractAddress={tokenAddressERC20}
      />
    </div>
  );
};
