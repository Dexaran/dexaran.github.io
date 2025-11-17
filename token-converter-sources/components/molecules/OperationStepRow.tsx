import clsx from "clsx";
import React, { PropsWithChildren, useMemo } from "react";
import { Address } from "viem";

import useCurrentChainId from "@/hooks/useCurrentChainId";
import { IconName } from "@/types/IconName";
import { clsxMerge } from "@/utils/clsxMerge";
import getExplorerLink, { ExplorerLinkType } from "@/utils/getExplorerLink";

import IconButton from "../atoms/IconButton";
import Preloader from "../atoms/Preloader";
import Svg from "../atoms/Svg";

export enum OperationStepStatus {
  IDLE,
  AWAITING_SIGNATURE,
  LOADING,
  STEP_COMPLETED,
  STEP_FAILED,
  OPERATION_COMPLETED,
}

export function OperationRows({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-5">{children}</div>;
}

export function operationStatusToStepStatus<TStatus extends string | number>({
  currentStatus,
  orderedSteps,
  stepIndex,
  pendingStep,
  loadingStep,
  errorStep,
  successStep,
}: {
  currentStatus: TStatus;
  orderedSteps: TStatus[];
  stepIndex: number;
  pendingStep: TStatus;
  loadingStep: TStatus;
  errorStep: TStatus;
  successStep: TStatus;
}): OperationStepStatus {
  if (currentStatus === successStep) {
    return OperationStepStatus.OPERATION_COMPLETED;
  }

  if (currentStatus === errorStep) {
    return OperationStepStatus.STEP_FAILED;
  }

  if (currentStatus === pendingStep) {
    return OperationStepStatus.AWAITING_SIGNATURE;
  }

  if (currentStatus === loadingStep) {
    return OperationStepStatus.LOADING;
  }

  const currentGroupIndex = Math.floor(orderedSteps.indexOf(currentStatus) / 3);
  if (currentGroupIndex > stepIndex) {
    return OperationStepStatus.STEP_COMPLETED;
  }

  if (currentGroupIndex < stepIndex) {
    return OperationStepStatus.IDLE;
  }

  return OperationStepStatus.IDLE;
}

export default function OperationStepRow({
  status,
  statusTextMap,
  hash,
  iconName,
  isFirstStep,
}: {
  status: OperationStepStatus;
  statusTextMap: Record<OperationStepStatus, string>;
  hash?: Address | undefined;
  iconName: IconName;
  isFirstStep: boolean;
}) {
  const chainId = useCurrentChainId();

  const text = useMemo(() => {
    return statusTextMap[status];
  }, [status, statusTextMap]);

  const isDisabled = useMemo(() => status === OperationStepStatus.IDLE, [status]);

  const icon = useMemo(() => {
    switch (status) {
      case OperationStepStatus.STEP_FAILED:
        return <Svg className="text-red-light" iconName="warning" size={20} />;
      case OperationStepStatus.LOADING:
        return <Preloader size={20} />;
      case OperationStepStatus.AWAITING_SIGNATURE:
        return (
          <>
            <Preloader type="linear" />
            <span className="text-secondary-text text-14">Proceed in your wallet</span>
          </>
        );
      case OperationStepStatus.STEP_COMPLETED:
      case OperationStepStatus.OPERATION_COMPLETED:
        return <Svg className="text-green" iconName="done" size={20} />;
      default:
        return null;
    }
  }, [status]);

  return (
    <div className="grid grid-cols-[32px_auto_1fr] gap-2 h-10">
      <div className="flex items-center h-full">
        <div
          className={clsxMerge(
            "p-1 rounded-full h-8 w-8 relative",
            isDisabled ? "bg-tertiary-bg" : "bg-green-bg",
            status === OperationStepStatus.STEP_FAILED && "bg-red-bg",
            !isFirstStep &&
              "before:absolute before:rounded-5 before:-top-2 before:left-1/2 before:w-0.5 before:h-3 before:-translate-x-1/2 before:-translate-y-full",
            [
              OperationStepStatus.OPERATION_COMPLETED,
              OperationStepStatus.AWAITING_SIGNATURE,
              OperationStepStatus.LOADING,
            ].includes(status)
              ? "before:bg-green"
              : "before:bg-[#3C4C4A]",
            status === OperationStepStatus.STEP_COMPLETED && "opacity-50",
          )}
        >
          <Svg
            className={clsxMerge(
              isDisabled ? "text-tertiary-text" : "text-green",
              status === OperationStepStatus.STEP_FAILED && "text-red-light",
            )}
            iconName={iconName}
          />
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <span
          className={clsx(
            "text-14",
            isDisabled || status === OperationStepStatus.STEP_COMPLETED
              ? "text-tertiary-text"
              : "text-primary-text",
          )}
        >
          {text}
        </span>
      </div>
      <div className="flex items-center gap-2 justify-end">
        {hash && (
          <a target="_blank" href={getExplorerLink(ExplorerLinkType.TRANSACTION, hash, chainId)}>
            <IconButton iconName="forward" />
          </a>
        )}
        {icon}
      </div>
    </div>
  );
}
