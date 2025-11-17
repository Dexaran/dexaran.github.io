import { useMemo } from "react";
import { parseGwei } from "viem";

import { useGlobalFees } from "@/hooks/useGlobalFees";

export default function useNetworkFeeGasValidation({
  ...values
}: {
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  gasPrice: string;
  gasLimit: string;
  estimatedGas: bigint;
}) {
  const { baseFee, priorityFee, gasPrice } = useGlobalFees();

  const maxFeePerGasError = useMemo(() => {
    return baseFee && parseGwei(values.maxFeePerGas) < baseFee
      ? "Max fee per gas is too low for current network condition"
      : undefined;
  }, [baseFee, values.maxFeePerGas]);

  const maxFeePerGasWarning = useMemo(() => {
    return baseFee && parseGwei(values.maxFeePerGas) > baseFee * BigInt(3)
      ? "Max fee per gas is unnecessarily high for current network condition"
      : undefined;
  }, [baseFee, values.maxFeePerGas]);

  const maxPriorityFeePerGasError = useMemo(() => {
    return parseGwei(values.maxPriorityFeePerGas) === BigInt(0)
      ? "Max priority fee per gas is too low for current network condition"
      : undefined;
  }, [values.maxPriorityFeePerGas]);

  const maxPriorityFeePerGasWarning = useMemo(() => {
    return priorityFee && parseGwei(values.maxPriorityFeePerGas) > priorityFee * BigInt(3)
      ? "Max priority fee per gas is unnecessarily high for current network condition"
      : undefined;
  }, [priorityFee, values.maxPriorityFeePerGas]);

  const legacyGasPriceError = useMemo(() => {
    return gasPrice && parseGwei(values.gasPrice) < gasPrice
      ? "Gas price is too low for current network condition"
      : undefined;
  }, [gasPrice, values.gasPrice]);

  const legacyGasPriceWarning = useMemo(() => {
    return gasPrice && parseGwei(values.gasPrice) > gasPrice * BigInt(3)
      ? "Gas price is unnecessarily high for current network condition"
      : undefined;
  }, [gasPrice, values.gasPrice]);

  const gasLimitError = useMemo(() => {
    return BigInt(values.gasLimit) < values.estimatedGas
      ? "Gas limit is lower then recommended"
      : undefined;
  }, [values.gasLimit, values.estimatedGas]);

  return {
    maxFeePerGasError,
    maxFeePerGasWarning,
    maxPriorityFeePerGasError,
    maxPriorityFeePerGasWarning,
    legacyGasPriceError,
    legacyGasPriceWarning,
    gasLimitError,
  };
}
