import { parseGwei } from "viem";

type ValidationResult = string | undefined;

export type EIP1559ValidatorSet = {
  maxFeePerGasError: (baseFee: bigint | undefined, maxFeePerGas: string) => ValidationResult;
  maxFeePerGasWarning: (baseFee: bigint | undefined, maxFeePerGas: string) => ValidationResult;
  maxPriorityFeePerGasError: (maxPriorityFeePerGas: string) => ValidationResult;
  maxPriorityFeePerGasWarning: (
    priorityFee: bigint | undefined,
    maxPriorityFeePerGas: string,
  ) => ValidationResult;
};

export const EIP1559Validators: Record<string, EIP1559ValidatorSet> = {
  default: {
    maxFeePerGasError: (baseFee, maxFeePerGas) =>
      baseFee && parseGwei(maxFeePerGas) < baseFee
        ? "Max fee per gas is too low for current network condition"
        : undefined,
    maxFeePerGasWarning: (baseFee, maxFeePerGas) =>
      baseFee && parseGwei(maxFeePerGas) > baseFee * BigInt(3)
        ? "Max fee per gas is unnecessarily high for current network condition"
        : undefined,
    maxPriorityFeePerGasError: (maxPriorityFeePerGas) =>
      parseGwei(maxPriorityFeePerGas) === BigInt(0)
        ? "Max priority fee per gas is too low for current network condition"
        : undefined,
    maxPriorityFeePerGasWarning: (priorityFee, maxPriorityFeePerGas) =>
      priorityFee && parseGwei(maxPriorityFeePerGas) > priorityFee * BigInt(3)
        ? "Max priority fee per gas is unnecessarily high for current network condition"
        : undefined,
  },
  reprice: {
    maxFeePerGasError: (baseFee, maxFeePerGas) =>
      baseFee && parseGwei(maxFeePerGas) < baseFee
        ? "Max fee per gas is too low for current network condition"
        : undefined,
    maxFeePerGasWarning: (baseFee, maxFeePerGas) =>
      baseFee && parseGwei(maxFeePerGas) > baseFee * BigInt(3)
        ? "Max fee per gas is unnecessarily high for current network condition"
        : undefined,
    maxPriorityFeePerGasError: (maxPriorityFeePerGas) =>
      parseGwei(maxPriorityFeePerGas) === BigInt(0)
        ? "Max priority fee per gas is too low for current network condition"
        : undefined,
    maxPriorityFeePerGasWarning: (priorityFee, maxPriorityFeePerGas) =>
      priorityFee && parseGwei(maxPriorityFeePerGas) > priorityFee * BigInt(3)
        ? "Max priority fee per gas is unnecessarily high for current network condition"
        : undefined,
  },
};
