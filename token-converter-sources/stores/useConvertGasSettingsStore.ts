import { createGasLimitStore } from "@/stores/factories/createGasLimitStore";
import { createGasPriceStore } from "@/stores/factories/createGasPriceStore";
import { createGasModeStore } from "@/stores/factories/createGasSettingsStore";

export const useConvertGasPriceStore = createGasPriceStore();
export const useConvertGasLimitStore = createGasLimitStore();
export const useConvertGasModeStore = createGasModeStore();
