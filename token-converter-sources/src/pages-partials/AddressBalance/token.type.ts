import { Address } from "viem";

export type Token = {
  tokenAddressERC20?: Address;
  tokenAddressERC223?: Address;
  symbol: string;
  logo?: string;
  decimals: number;
  markets?: number[];
  isErc223?: boolean;
};

