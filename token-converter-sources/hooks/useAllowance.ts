import { useCallback, useMemo } from "react";
import { Abi, Address } from "viem";
import { useAccount, usePublicClient, useReadContract, useWalletClient } from "wagmi";

import { ERC20_ABI } from "@/abis/erc20";
import { MAX_SAFE_INTEGER, USDT_ADDRESS_ERC_20 } from "@/config";
import { DexChainId } from "@/config/networks.config";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import { TwoStandardToken } from "@/types/Token";
import addToast from "@/utils/addToast";
import { getTransactionWithRetries } from "@/utils/getTransactionWithRetries";

const allowanceGasLimitMap: Record<DexChainId, { base: bigint; additional: bigint }> = {
  [DexChainId.MAINNET]: { base: BigInt(50000), additional: BigInt(12000) },
};

const defaultApproveValue = BigInt(46000);

type CustomGasSettings =
  | {
      maxPriorityFeePerGas: bigint | undefined;
      maxFeePerGas: bigint | undefined;
      gasPrice?: undefined;
    }
  | {
      gasPrice: bigint | undefined;
      maxPriorityFeePerGas?: undefined;
      maxFeePerGas?: undefined;
    }
  | undefined;

export function useStoreAllowance({
  token,
  contractAddress,
  amountToCheck,
}: {
  token: TwoStandardToken | undefined;
  contractAddress: Address | undefined;
  amountToCheck: bigint | null;
}) {
  const { address } = useAccount();
  const chainId = useCurrentChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const { refetch, data: currentAllowanceData } = useReadContract({
    abi: ERC20_ABI,
    address: token?.address0,
    functionName: "allowance",
    args: [
      //set ! to avoid ts errors, make sure it is not undefined with "enabled" option
      address!,
      contractAddress!,
    ],
    scopeKey: `${token?.address0}-${contractAddress}-${address}-${chainId}`,
    query: {
      //make sure hook don't run when there is no addresses
      enabled: Boolean(token?.address0) && Boolean(address) && Boolean(contractAddress),
    },
  });

  const gasLimit = useMemo(() => {
    if (allowanceGasLimitMap[chainId]) {
      return allowanceGasLimitMap[chainId].additional + allowanceGasLimitMap[chainId].base;
    }

    return defaultApproveValue;
  }, [chainId]);

  const waitAndReFetch = useCallback(
    async (hash: Address) => {
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
        await refetch();
      }
    },
    [publicClient, refetch],
  );

  const isAllowed = useMemo(() => {
    return Boolean(currentAllowanceData && amountToCheck && currentAllowanceData >= amountToCheck);
  }, [amountToCheck, currentAllowanceData]);

  const writeTokenApprove = useCallback(
    async ({
      customAmount,
      customGasSettings,
    }: {
      customAmount?: bigint;
      customGasSettings?: CustomGasSettings;
    }) => {
      const amountToApprove = customAmount || amountToCheck;

      if (
        !amountToApprove ||
        !contractAddress ||
        !token ||
        !walletClient ||
        !address ||
        !chainId ||
        !publicClient
      ) {
        console.error("Error: writeTokenApprove ~ something undefined");
        return;
      }

      const params: {
        address: Address;
        account: Address;
        abi: Abi;
        functionName: "approve";
        args: [Address, bigint];
      } = {
        address: token.address0 as Address,
        account: address,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [contractAddress!, amountToApprove!],
      };

      // USDT can't rewrite existing allowance, so we have to manually revoke allowance
      // to 0 before we can attach an allowance. This flag check if token can rewrite allowance,
      // that in this case with USDT results to true
      const isNotAvailableToRewriteAllowance =
        token.address0.toLowerCase() === USDT_ADDRESS_ERC_20.toLowerCase();

      if (!isAllowed && currentAllowanceData !== BigInt(0) && isNotAvailableToRewriteAllowance) {
        const revokeParams = { ...params, args: [contractAddress, BigInt(0)] };

        //we are calling the same approve with 0 as amount to approve
        const hash = await walletClient.writeContract({
          ...revokeParams,
          ...(customGasSettings || {}),
          gas: gasLimit,
          account: undefined,
        });

        // we wait until first function is ready so we are sure that second one will write
        // await publicClient.waitForTransactionReceipt({ hash });
      }

      try {
        let hash;

        try {
          if (isNotAvailableToRewriteAllowance) {
            hash = await walletClient.writeContract({
              ...params,
              ...(customGasSettings || {}),
              args: [contractAddress!, MAX_SAFE_INTEGER],
              gas: gasLimit,
              account: undefined,
            });
          } else {
            const { request } = await publicClient.simulateContract({
              ...params,
              ...(customGasSettings || {}),
              gas: gasLimit,
            });
            hash = await walletClient.writeContract({ ...request, account: undefined });
          }
        } catch (e) {
          console.log(e);
        }

        if (hash) {
          const transaction = await getTransactionWithRetries({ hash, publicClient });

          if (transaction) {
            const transaction = await publicClient.getTransaction({
              hash,
              blockTag: "pending" as any,
            });

            const nonce = transaction.nonce;

            // no await needed, function should return hash without waiting
            waitAndReFetch(hash);

            return { success: true as const, hash };
          }
        }

        return { success: false as const };
      } catch (e) {
        console.log(e);
        addToast((e as any).toString(), "error");
        return { success: false as const };
      }
    },
    [
      amountToCheck,
      contractAddress,
      token,
      walletClient,
      address,
      chainId,
      publicClient,
      isAllowed,
      currentAllowanceData,
      gasLimit,
      waitAndReFetch,
    ],
  );

  return {
    isAllowed,
    writeTokenApprove,
    currentAllowance: currentAllowanceData,
    estimatedGas: allowanceGasLimitMap[chainId]?.base || defaultApproveValue,
    updateAllowance: refetch,
  };
}
