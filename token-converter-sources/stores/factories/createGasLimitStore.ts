import { create } from "zustand";

interface GasLimitSettingsStore {
  customGasLimit: bigint | undefined;
  estimatedGas: bigint;
  setCustomGasLimit: (customGas: bigint | undefined) => void;
  setEstimatedGas: (estimatedGas: bigint) => void;
}

type GasLimitSettingsData = Pick<GasLimitSettingsStore, "customGasLimit" | "estimatedGas">;

const initialGasLimitSettings: GasLimitSettingsData = {
  customGasLimit: undefined,
  estimatedGas: BigInt(0),
};

export const createGasLimitStore = (initialData: GasLimitSettingsData = initialGasLimitSettings) =>
  create<GasLimitSettingsStore>((set) => ({
    customGasLimit: initialData.customGasLimit,
    estimatedGas: initialData.estimatedGas,
    setCustomGasLimit: (gasLimit) => set({ customGasLimit: gasLimit }),
    setEstimatedGas: (estimatedGas) => set({ estimatedGas }),
  }));
