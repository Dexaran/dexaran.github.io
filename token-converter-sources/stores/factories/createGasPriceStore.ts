import { create } from "zustand";

import { isEip1559Supported } from "@/config/eip1559";
import { DexChainId } from "@/config/networks.config";

export enum GasFeeModel {
  EIP1559,
  LEGACY,
}
export enum GasOption {
  CHEAP,
  FAST,
  CUSTOM,
}

export type GasSettings =
  | {
      model: GasFeeModel.EIP1559;
      maxFeePerGas: bigint | undefined;
      maxPriorityFeePerGas: bigint | undefined;
    }
  | {
      model: GasFeeModel.LEGACY;
      gasPrice: bigint | undefined;
    };
interface GasPriceSettingsStore {
  gasPriceOption: GasOption;
  gasPriceSettings: GasSettings;
  setGasPriceOption: (gasOption: GasOption) => void;
  setGasPriceSettings: (gasSettings: GasSettings) => void;
  updateDefaultState: (chainId: DexChainId) => void;
}

type GasPriceSettingsData = Pick<GasPriceSettingsStore, "gasPriceOption" | "gasPriceSettings">;

export const initialGasPriceSettingsEIP1559: GasPriceSettingsData = {
  gasPriceOption: GasOption.CHEAP,
  gasPriceSettings: {
    model: GasFeeModel.EIP1559,
    maxFeePerGas: undefined,
    maxPriorityFeePerGas: undefined,
  },
};

export const initialGasPriceSettingsLegacy: GasPriceSettingsData = {
  gasPriceOption: GasOption.CHEAP,
  gasPriceSettings: {
    model: GasFeeModel.LEGACY,
    gasPrice: undefined,
  },
};
export const createGasPriceStore = (
  initialData: GasPriceSettingsData = initialGasPriceSettingsEIP1559,
) =>
  create<GasPriceSettingsStore>((set) => ({
    gasPriceOption: initialData.gasPriceOption,
    gasPriceSettings: initialData.gasPriceSettings,
    setGasPriceOption: (gasPriceOption) => set({ gasPriceOption }),
    setGasPriceSettings: (gasPriceSettings) => set({ gasPriceSettings }),
    updateDefaultState: (chainId: DexChainId) =>
      set(() => {
        if (isEip1559Supported(chainId)) {
          return initialGasPriceSettingsEIP1559;
        } else {
          return initialGasPriceSettingsLegacy;
        }
      }),
  }));
