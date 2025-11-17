import { DexChainId } from "@/config/networks.config";
import { GasOption } from "@/stores/factories/createGasPriceStore";

type GasOptionWithoutCustom = Exclude<GasOption, GasOption.CUSTOM>;

export const baseFeeMultipliers: Record<DexChainId, Record<GasOptionWithoutCustom, bigint>> = {
  [DexChainId.MAINNET]: {
    [GasOption.CHEAP]: BigInt(120),
    [GasOption.FAST]: BigInt(200),
  },
};

export const SCALING_FACTOR = BigInt(100);
