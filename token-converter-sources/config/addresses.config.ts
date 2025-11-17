import { Address } from "viem";

import { DexChainId } from "@/config/networks.config";

export const CONVERTER_ADDRESS: Record<DexChainId, Address> = {
  [DexChainId.MAINNET]: "0xe7E969012557f25bECddB717A3aa2f4789ba9f9a",
};
