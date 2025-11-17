import { OperationStepStatus } from "@/components/molecules/OperationStepRow";

export function getApproveTextMap(tokenSymbol: string): Record<OperationStepStatus, string> {
  return {
    [OperationStepStatus.IDLE]: `Approve ${tokenSymbol}`,
    [OperationStepStatus.AWAITING_SIGNATURE]: `Approve ${tokenSymbol}`,
    [OperationStepStatus.LOADING]: `Approving ${tokenSymbol}`,
    [OperationStepStatus.STEP_COMPLETED]: `Approved ${tokenSymbol}`,
    [OperationStepStatus.STEP_FAILED]: `Approve ${tokenSymbol} failed`,
    [OperationStepStatus.OPERATION_COMPLETED]: `Approved ${tokenSymbol}`,
  };
}

export function getTransferTextMap(tokenSymbol: string): Record<OperationStepStatus, string> {
  return {
    [OperationStepStatus.IDLE]: `Transfer ${tokenSymbol}`,
    [OperationStepStatus.AWAITING_SIGNATURE]: `Transfer ${tokenSymbol}`,
    [OperationStepStatus.LOADING]: `Transferring ${tokenSymbol}`,
    [OperationStepStatus.STEP_COMPLETED]: `Transferred ${tokenSymbol}`,
    [OperationStepStatus.STEP_FAILED]: `${tokenSymbol} transfer failed`,
    [OperationStepStatus.OPERATION_COMPLETED]: `Transferred ${tokenSymbol}`,
  };
}
