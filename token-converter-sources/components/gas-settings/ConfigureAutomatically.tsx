import React from "react";
import { formatGwei } from "viem";

import { baseFeeMultipliers, SCALING_FACTOR } from "@/config/baseFeeMultipliers";
import { ThemeColors } from "@/config/theme-colors.config";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import { useGlobalFees } from "@/hooks/useGlobalFees";
import { GasFeeModel, GasOption } from "@/stores/factories/createGasPriceStore";

import TextButton from "../atoms/TextButton";

export default function ConfigureAutomatically({
  gasPriceModel,
  setFieldValue,
}: {
  gasPriceModel: GasFeeModel;
  setFieldValue: any;
}) {
  const chainId = useCurrentChainId();
  const { baseFee, priorityFee, gasPrice } = useGlobalFees();
  return (
    <div className="flex justify-between items-center pb-3 pt-3">
      <span>
        <span className="hidden text-tertiary-text md:inline">Custom gas settings</span>
      </span>
      <TextButton
        colorScheme={ThemeColors.PURPLE}
        onClick={() => {
          const multiplier = baseFeeMultipliers[chainId][GasOption.CHEAP];

          if (gasPriceModel === GasFeeModel.EIP1559) {
            if (baseFee) {
              setFieldValue("maxFeePerGas", formatGwei((baseFee * multiplier) / SCALING_FACTOR));
            }
            if (priorityFee) {
              setFieldValue(
                "maxPriorityFeePerGas",
                formatGwei((priorityFee * multiplier) / SCALING_FACTOR),
              );
            }
          }

          if (gasPriceModel === GasFeeModel.LEGACY) {
            if (gasPrice) {
              setFieldValue("gasPrice", formatGwei((gasPrice * multiplier) / SCALING_FACTOR));
            }
          }
        }}
        type="reset"
        endIcon="reset"
        className="pr-0"
      >
        Configure automatically
      </TextButton>
    </div>
  );
}
