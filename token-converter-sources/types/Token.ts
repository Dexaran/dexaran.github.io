import { Address } from "viem";

import { DexChainId } from "@/config/networks.config";

export type TwoStandardToken = {
  chainId: DexChainId;
  address0: Address;
  address1: Address;
  decimals: number;
  name: string;
  symbol: string;
  logoURI?: string;
  isErc223Origin?: boolean;
};
