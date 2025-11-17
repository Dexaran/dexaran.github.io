"use client";
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { formatGwei, parseUnits } from "viem";

import Badge, { BadgeVariant } from "@/components/atoms/Badge";
import Button, { ButtonColor, ButtonSize } from "@/components/atoms/Button";
import DialogHeader from "@/components/atoms/DialogHeader";
import DrawerDialog from "@/components/atoms/DrawerDialog";
import EmptyStateIcon from "@/components/atoms/EmptyStateIcon";
import Input from "@/components/atoms/Input";
import Svg from "@/components/atoms/Svg";
import OperationStepRow, {
  OperationRows,
  operationStatusToStepStatus,
  OperationStepStatus,
} from "@/components/molecules/OperationStepRow";
import { CONVERTER_ADDRESS } from "@/config/addresses.config";
import { basePath } from "@/config/build/paths";
import { Standard } from "@/config/standard.config";
import { useStoreAllowance } from "@/hooks/useAllowance";
import useConvert from "@/hooks/useConvert";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import { useGlobalFees } from "@/hooks/useGlobalFees";
import { GasFeeModel } from "@/stores/factories/createGasPriceStore";
import { useConfirmConvertDialogStore } from "@/stores/useConfirmConvertDialogOpened";
import { useConvertAmountStore } from "@/stores/useConvertAmountStore";
import {
  useConvertGasLimitStore,
  useConvertGasPriceStore,
} from "@/stores/useConvertGasSettingsStore";
import { ConvertStatus, useConvertStatusStore } from "@/stores/useConvertStatusStore";
import { useConvertTokensStore } from "@/stores/useConvertTokenStore";
import { IconName } from "@/types/IconName";
import { TwoStandardToken } from "@/types/Token";
import { formatFloat } from "@/utils/formatFloat";
import { getApproveTextMap } from "@/utils/getStepTexts";

import Tooltip from "../atoms/Tooltip";
import SwapDetailsRow from "./SwapDetailsRow";

type StepTextMap = {
  [key in OperationStepStatus]: string;
};

type OperationStepConfig = {
  iconName: IconName;
  textMap: StepTextMap;
  pending: ConvertStatus;
  loading: ConvertStatus;
  error: ConvertStatus;
};

function composeConvertSteps({
  assetStandard,
  assetSymbol,
}: {
  assetStandard: Standard;
  assetSymbol: string;
}): OperationStepConfig[] {
  const approveStep: OperationStepConfig = {
    iconName: "done",
    pending: ConvertStatus.PENDING_APPROVE,
    loading: ConvertStatus.LOADING_APPROVE,
    error: ConvertStatus.ERROR_APPROVE,
    textMap: getApproveTextMap(assetSymbol || "Unknown"),
  } as const;

  const convertStep: OperationStepConfig = {
    iconName: "convert",
    pending: ConvertStatus.PENDING_CONVERT,
    loading: ConvertStatus.LOADING_CONVERT,
    error: ConvertStatus.ERROR_CONVERT,
    textMap: {
      [OperationStepStatus.IDLE]: "Confirm conversion",
      [OperationStepStatus.AWAITING_SIGNATURE]: "Confirm conversion",
      [OperationStepStatus.LOADING]: "Conversion in progress",
      [OperationStepStatus.STEP_COMPLETED]: "Conversion completed",
      [OperationStepStatus.STEP_FAILED]: "Conversion failed",
      [OperationStepStatus.OPERATION_COMPLETED]: "Conversion completed",
    },
  } as const;

  if (assetStandard === Standard.ERC20) {
    return [approveStep, convertStep];
  } else {
    return [convertStep];
  }
}

function ConvertActionButton({
  disabled,
  amountToApprove,
}: {
  disabled: boolean;
  amountToApprove: string;
}) {
  const { handleConvert } = useConvert();
  const { token, tokenStandard } = useConvertTokensStore();
  const { status, approveHash, convertHash } = useConvertStatusStore();

  const hashes = useMemo(() => {
    if (tokenStandard === Standard.ERC20) {
      return [approveHash, convertHash];
    }

    return [convertHash];
  }, [convertHash, approveHash, tokenStandard]);

  if (status !== ConvertStatus.INITIAL) {
    return (
      <OperationRows>
        {composeConvertSteps({
          assetStandard: tokenStandard,
          assetSymbol: token?.symbol || "Unknown",
        }).map((step, index) => (
          <OperationStepRow
            key={index}
            iconName={step.iconName}
            hash={hashes[index]}
            statusTextMap={step.textMap}
            status={operationStatusToStepStatus({
              currentStatus: status,
              orderedSteps: composeConvertSteps({
                assetStandard: tokenStandard,
                assetSymbol: token?.symbol || "Unknown",
              }).flatMap((s) => [s.pending, s.loading, s.error]),
              stepIndex: index,
              pendingStep: step.pending,
              loadingStep: step.loading,
              errorStep: step.error,
              successStep: ConvertStatus.SUCCESS,
            })}
            isFirstStep={index === 0}
          />
        ))}
      </OperationRows>
    );
  }

  return (
    <Button disabled={disabled} onClick={() => handleConvert(amountToApprove)} fullWidth>
      Confirm conversion
    </Button>
  );
}

export function ReadonlyTokenAmountCard({
  token,
  amount,
  amountUSD,
  standard,
  title,
}: {
  token: TwoStandardToken | undefined;
  amount: string;
  amountUSD: string | undefined;
  standard: Standard;
  title: string;
}) {
  return (
    <div className="rounded-3 bg-tertiary-bg py-4 px-5 flex flex-col gap-1">
      <p className="text-secondary-text text-14">{title}</p>
      <div className="flex justify-between items-center text-20">
        <span>{amount}</span>
        <div className="flex items-center gap-2">
          <Image
            src={token?.logoURI || `${basePath}/images/tokens/placeholder.svg`}
            alt=""
            width={32}
            height={32}
          />
          {token?.symbol}
          <Badge variant={BadgeVariant.STANDARD} standard={standard} />
        </div>
      </div>
      <p className="text-secondary-text text-14">${amountUSD}</p>
    </div>
  );
}

export default function ConfirmConvertDialog() {
  const { token, tokenStandard, reset } = useConvertTokensStore();
  const { typedValue, reset: resetAmounts } = useConvertAmountStore();
  const chainId = useCurrentChainId();

  const { isOpen, setIsOpen } = useConfirmConvertDialogStore();

  const { status, setStatus } = useConvertStatusStore();

  const isInitialStatus = useMemo(() => status === ConvertStatus.INITIAL, [status]);
  const isFinalStatus = useMemo(
    () =>
      status === ConvertStatus.SUCCESS ||
      status === ConvertStatus.ERROR_CONVERT ||
      status === ConvertStatus.ERROR_APPROVE,
    [status],
  );
  const isLoadingStatus = useMemo(
    () => !isInitialStatus && !isFinalStatus,
    [isFinalStatus, isInitialStatus],
  );

  const { estimatedGas, customGasLimit } = useConvertGasLimitStore();

  const [amountToApprove, setAmountToApprove] = useState(typedValue);

  useEffect(() => {
    if (typedValue) {
      setAmountToApprove(typedValue);
    }
  }, [typedValue]);

  const { gasPriceSettings } = useConvertGasPriceStore();
  const { baseFee } = useGlobalFees();

  const computedGasSpending = useMemo(() => {
    if (gasPriceSettings.model === GasFeeModel.LEGACY && gasPriceSettings.gasPrice) {
      return formatFloat(formatGwei(gasPriceSettings.gasPrice));
    }

    if (
      gasPriceSettings.model === GasFeeModel.EIP1559 &&
      gasPriceSettings.maxFeePerGas &&
      gasPriceSettings.maxPriorityFeePerGas &&
      baseFee
    ) {
      const lowerFeePerGas =
        gasPriceSettings.maxFeePerGas > baseFee ? baseFee : gasPriceSettings.maxFeePerGas;

      return formatFloat(formatGwei(lowerFeePerGas + gasPriceSettings.maxPriorityFeePerGas));
    }

    return "0";
  }, [baseFee, gasPriceSettings]);

  useEffect(() => {
    if (isFinalStatus && !isOpen) {
      setTimeout(() => {
        setStatus(ConvertStatus.INITIAL);
      }, 400);
    }
  }, [isFinalStatus, isOpen, setStatus]);

  const [isEditApproveActive, setEditApproveActive] = useState(false);

  const { isAllowed: isAllowedA } = useStoreAllowance({
    token: token,
    contractAddress: CONVERTER_ADDRESS[chainId],
    amountToCheck: parseUnits(typedValue, token?.decimals ?? 18),
  });

  // const { price: priceA } = useUSDPrice(tokenA?.wrapped.address0);

  // const { price: priceNative } = useUSDPrice(wrappedTokens[chainId]?.address0);

  return (
    <DrawerDialog
      isOpen={isOpen}
      setIsOpen={(isOpen) => {
        setIsOpen(isOpen);
      }}
    >
      <div className="bg-primary-bg rounded-5 w-full sm:w-[600px]">
        <DialogHeader
          onClose={() => {
            setIsOpen(false);
          }}
          title={"Review conversion"}
        />
        <div className="card-spacing">
          {(isInitialStatus || isLoadingStatus) && (
            <>
              <div className="flex flex-col gap-3">
                <ReadonlyTokenAmountCard
                  token={token}
                  amount={typedValue}
                  amountUSD={""}
                  standard={tokenStandard}
                  title={"You convert"}
                />
                <ReadonlyTokenAmountCard
                  token={token}
                  amount={typedValue}
                  amountUSD={""}
                  standard={tokenStandard === Standard.ERC20 ? Standard.ERC223 : Standard.ERC20}
                  title={"You receive"}
                />
              </div>
            </>
          )}
          {isLoadingStatus && <></>}
          {isFinalStatus && (
            <>
              <div>
                <div className="mx-auto w-[80px] h-[80px] flex items-center justify-center relative mb-5">
                  {(status === ConvertStatus.ERROR_APPROVE ||
                    status === ConvertStatus.ERROR_CONVERT) && (
                    <EmptyStateIcon iconName="warning" />
                  )}

                  {status === ConvertStatus.SUCCESS && (
                    <>
                      <div className="w-[54px] h-[54px] rounded-full border-[7px] blur-[8px] opacity-80 border-green" />
                      <Svg
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green"
                        iconName={"success"}
                        size={65}
                      />
                    </>
                  )}
                </div>

                <div className="flex justify-center mb-1">
                  <span className="text-20 font-bold text-primary-text mb-1">
                    {status === ConvertStatus.ERROR_CONVERT && "Conversion failed"}
                    {status === ConvertStatus.SUCCESS && "Conversion completed"}
                    {status === ConvertStatus.ERROR_APPROVE && "Approve failed"}
                  </span>
                </div>

                <div className="flex justify-center gap-2 mb-2">
                  <Image
                    src={token?.logoURI || `${basePath}/images/tokens/placeholder.svg`}
                    alt=""
                    width={24}
                    height={24}
                  />
                  <span>
                    {token?.symbol} {typedValue}
                  </span>
                </div>

                <div className="flex justify-center gap-2 items-center">
                  <Badge variant={BadgeVariant.STANDARD} standard={tokenStandard} />
                  <Svg className="text-tertiary-text" iconName="next" />
                  <Badge
                    variant={BadgeVariant.STANDARD}
                    standard={tokenStandard === Standard.ERC20 ? Standard.ERC223 : Standard.ERC20}
                  />
                </div>
              </div>
            </>
          )}

          {isInitialStatus && (
            <div className="pb-4 flex flex-col gap-2 rounded-b-3 text-14 mt-4">
              <SwapDetailsRow
                title={"Network fee"}
                value={
                  <div>
                    <span className="text-secondary-text mr-1 text-14">
                      {computedGasSpending} GWEI
                    </span>{" "}
                    <span className="mr-1 text-14">
                      {/*{priceNative && `~$${formatFloat(priceNative * +computedGasSpending)}`}*/}
                    </span>
                  </div>
                }
                tooltipText={
                  "t(network_fee_tooltip, {networkName: networks.find((n) => n.chainId === chainId)?.name,})"
                }
              />

              <SwapDetailsRow
                title={"Gas limit"}
                value={
                  customGasLimit
                    ? customGasLimit.toString()
                    : (estimatedGas + BigInt(30000)).toString() || "Loading..."
                }
                tooltipText={"Gas tooltip"}
              />

              {tokenStandard === Standard.ERC20 && !isAllowedA && (
                <div
                  className={clsx(
                    "bg-tertiary-bg rounded-3 flex items-center px-5 py-2 min-h-12 mt-2 gap-2",
                    +amountToApprove < +typedValue && "sm:pb-[26px]",
                  )}
                >
                  <div className="sm:items-center sm:justify-between sm:gap-5 flex-grow flex flex-col gap-1 sm:flex-row">
                    <div className="flex items-center gap-1 text-secondary-text whitespace-nowrap sm:flex-row-reverse">
                      <span>Approve amount</span>
                      <Tooltip
                        text={
                          "In order to make a swap with ERC-20 token you need to give the DEX contract permission to withdraw your tokens. All DEX'es require this operation. Here you are specifying the amount of tokens that you allow the contract to transfer on your behalf. Note that this amount never expires."
                        }
                      />
                    </div>

                    {!isEditApproveActive ? (
                      <span>
                        {amountToApprove} {token?.symbol || "Unknown"}
                      </span>
                    ) : (
                      <div className="flex-grow">
                        <div className="relative w-full flex-grow">
                          <NumericFormat
                            inputMode="decimal"
                            allowedDecimalSeparators={[","]}
                            isError={+amountToApprove < +typedValue}
                            className="h-8 pl-3"
                            value={amountToApprove}
                            onValueChange={(values) => {
                              setAmountToApprove(values.value);
                            }}
                            customInput={Input}
                            allowNegative={false}
                            type="text"
                          />
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-tertiary-text">
                            {token?.symbol || "Unknown"}
                          </span>
                        </div>
                        {+amountToApprove < +typedValue && (
                          <span className="text-red-light sm:absolute text-12 sm:translate-y-0.5">
                            Must be higher or equal {typedValue}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    {!isEditApproveActive ? (
                      <Button
                        size={ButtonSize.EXTRA_SMALL}
                        mobileSize={ButtonSize.SMALL}
                        colorScheme={ButtonColor.LIGHT_GREEN}
                        onClick={() => setEditApproveActive(true)}
                        className="!rounded-20"
                      >
                        Edit
                      </Button>
                    ) : (
                      <Button
                        disabled={+amountToApprove < +typedValue}
                        size={ButtonSize.EXTRA_SMALL}
                        mobileSize={ButtonSize.SMALL}
                        colorScheme={ButtonColor.LIGHT_GREEN}
                        onClick={() => setEditApproveActive(false)}
                        className="!rounded-20 disabled:bg-quaternary-bg"
                      >
                        Save
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {!isInitialStatus && <div className="h-px w-full bg-secondary-border mb-4 mt-5" />}
          <ConvertActionButton disabled={isEditApproveActive} amountToApprove={amountToApprove} />
        </div>
      </div>
    </DrawerDialog>
  );
}
