import { baseFeeMultipliers, SCALING_FACTOR } from "@/config/baseFeeMultipliers";
import { DexChainId } from "@/config/networks.config";
import { GasFeeModel, GasOption, GasSettings } from "@/stores/factories/createGasPriceStore";

export const getGasSettings = ({
  baseFee,
  chainId,
  gasPrice,
  priorityFee,
  gasPriceOption,
  gasPriceSettings,
}: {
  baseFee?: bigint;
  chainId: DexChainId;
  gasPrice?: bigint;
  priorityFee?: bigint;
  gasPriceOption: GasOption;
  gasPriceSettings: GasSettings;
}) => {
  if (gasPriceOption !== GasOption.CUSTOM) {
    const multiplier = baseFeeMultipliers[chainId][gasPriceOption];
    switch (gasPriceSettings.model) {
      case GasFeeModel.EIP1559:
        if (priorityFee && baseFee) {
          return {
            maxPriorityFeePerGas: (priorityFee * multiplier) / SCALING_FACTOR,
            maxFeePerGas: (baseFee * multiplier) / SCALING_FACTOR,
          };
        }
        break;

      case GasFeeModel.LEGACY:
        if (gasPrice) {
          return {
            gasPrice: (gasPrice * multiplier) / SCALING_FACTOR,
          };
        }
        break;
    }
  } else {
    switch (gasPriceSettings.model) {
      case GasFeeModel.EIP1559:
        return {
          maxPriorityFeePerGas: gasPriceSettings.maxPriorityFeePerGas,
          maxFeePerGas: gasPriceSettings.maxFeePerGas,
        };

      case GasFeeModel.LEGACY:
        return { gasPrice: gasPriceSettings.gasPrice };
    }
  }
};

export const getFormattedGasPrice = ({
  baseFee,
  chainId,
  gasPrice,
  gasPriceOption,
  gasPriceSettings,
}: {
  baseFee?: bigint;
  chainId: DexChainId;
  gasPrice?: bigint;
  gasPriceOption: GasOption;
  gasPriceSettings: GasSettings;
}) => {
  if (gasPriceOption !== GasOption.CUSTOM) {
    const multiplier = baseFeeMultipliers[chainId][gasPriceOption];
    switch (gasPriceSettings.model) {
      case GasFeeModel.EIP1559:
        if (baseFee) {
          return (baseFee * multiplier) / SCALING_FACTOR;
        }
        break;

      case GasFeeModel.LEGACY:
        if (gasPrice) {
          return (gasPrice * multiplier) / SCALING_FACTOR;
        }
    }
  } else {
    switch (gasPriceSettings.model) {
      case GasFeeModel.EIP1559:
        return gasPriceSettings.maxFeePerGas;
      case GasFeeModel.LEGACY:
        return gasPriceSettings.gasPrice;
    }
  }
};
