import { useCallback } from "react";
import { Address } from "viem";
import { useAccount, useBalance } from "wagmi";

import { TwoStandardToken } from "@/types/Token";

export default function useTokenBalances(
  currency: TwoStandardToken | undefined | null,
  address?: Address,
) {
  const { address: userAddress } = useAccount();

  const _address = address || userAddress;

  const { data: erc20Balance, refetch: refetch20 } = useBalance({
    address: currency ? _address : undefined,
    token: currency?.address0,
    query: {
      enabled: Boolean(currency),
    },
  });
  const { data: erc223Balance, refetch: refetch223 } = useBalance({
    address: currency ? _address : undefined,
    token: currency?.address1,
    query: {
      enabled: Boolean(currency),
    },
  });

  const refetch = useCallback(() => {
    // console.log("Balances refetching...");
    refetch20();
    refetch223();
  }, [refetch20, refetch223]);

  return { balance: { erc20Balance, erc223Balance }, refetch };
}
