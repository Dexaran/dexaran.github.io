import { useCallback, useMemo } from "react";
import { encodeFunctionData, parseUnits } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { ERC223_ABI } from "@/abis/erc223";
import { TOKEN_CONVERTER_ABI } from "@/abis/tokenConverter";
import { CONVERTER_ADDRESS } from "@/config/addresses.config";
import { DEX_SUPPORTED_CHAINS, DexChainId } from "@/config/networks.config";
import { getTokenAddressForStandard, Standard } from "@/config/standard.config";
import { useStoreAllowance } from "@/hooks/useAllowance";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import useDeepEffect from "@/hooks/useDeepEffect";
import { useGlobalFees } from "@/hooks/useGlobalFees";
import { useConvertAmountStore } from "@/stores/useConvertAmountStore";
import {
  useConvertGasLimitStore,
  useConvertGasPriceStore,
} from "@/stores/useConvertGasSettingsStore";
import { ConvertError, ConvertStatus, useConvertStatusStore } from "@/stores/useConvertStatusStore";
import { useConvertTokensStore } from "@/stores/useConvertTokenStore";
import addToast from "@/utils/addToast";
import { getGasSettings } from "@/utils/gasSettings";
import { getTransactionWithRetries } from "@/utils/getTransactionWithRetries";
import { IIFE } from "@/utils/IIFE";

export function useConvertParams() {
  const { token, tokenStandard } = useConvertTokensStore();
  const chainId = useCurrentChainId();
  const { address } = useAccount();

  const { typedValue } = useConvertAmountStore();

  const convertParams = useMemo(() => {
    if (!token || !chainId || !DEX_SUPPORTED_CHAINS.includes(chainId) || !typedValue || !address) {
      return null;
    }

    if (tokenStandard === Standard.ERC223) {
      return {
        address: getTokenAddressForStandard(token, tokenStandard),
        abi: ERC223_ABI,
        functionName: "transfer" as const,
        args: [
          CONVERTER_ADDRESS[chainId as DexChainId],
          parseUnits(typedValue, token.decimals),
          encodeFunctionData({
            abi: TOKEN_CONVERTER_ABI,
            functionName: "convertERC20" as const,
            args: [token.address0, parseUnits(typedValue, token.decimals)],
          }),
        ],
      };
    }

    if (tokenStandard === Standard.ERC20) {
      return {
        address: CONVERTER_ADDRESS[chainId as DexChainId],
        abi: TOKEN_CONVERTER_ABI,
        functionName: "convertERC20" as const,
        args: [token.address0, parseUnits(typedValue, token.decimals)],
      };
    }
  }, [address, chainId, tokenStandard, token, typedValue]);

  return { convertParams };
}

export function useConvertEstimatedGas() {
  const { address } = useAccount();
  const { convertParams } = useConvertParams();
  const publicClient = usePublicClient();
  const { setEstimatedGas } = useConvertGasLimitStore();
  const { token, tokenStandard } = useConvertTokensStore();
  const chainId = useCurrentChainId();
  const { typedValue } = useConvertAmountStore();

  const { isAllowed: isAllowedA } = useStoreAllowance({
    token: token,
    contractAddress: CONVERTER_ADDRESS[chainId],
    amountToCheck: parseUnits(typedValue, token?.decimals ?? 18),
  });

  useDeepEffect(() => {
    IIFE(async () => {
      if (!convertParams || !address || (!isAllowedA && tokenStandard === Standard.ERC20)) {
        setEstimatedGas(BigInt(100000));
        console.log("Can't estimate gas");
        return;
      }

      try {
        const estimated = await publicClient?.estimateContractGas({
          account: address,
          ...convertParams,
        } as any);

        if (estimated) {
          setEstimatedGas(estimated + BigInt(10000));
        } else {
          setEstimatedGas(BigInt(100000));
        }
        // console.log(estimated);
      } catch (e) {
        console.log(e);
        setEstimatedGas(BigInt(100000));
      }
    });
  }, [publicClient, address, convertParams, isAllowedA]);
}

export default function useConvert() {
  const { data: walletClient } = useWalletClient();
  const { token, tokenStandard } = useConvertTokensStore();
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const chainId = useCurrentChainId();

  const { customGasLimit, estimatedGas } = useConvertGasLimitStore();
  const { gasPriceOption, gasPriceSettings } = useConvertGasPriceStore();

  const { baseFee, priorityFee, gasPrice } = useGlobalFees();

  const { typedValue } = useConvertAmountStore();

  const { status, setStatus, setConvertHash, setApproveHash, setErrorType } =
    useConvertStatusStore();

  const {
    isAllowed: isAllowedA,
    writeTokenApprove: approveA,
    updateAllowance,
  } = useStoreAllowance({
    token: token,
    contractAddress: CONVERTER_ADDRESS[chainId],
    amountToCheck: parseUnits(typedValue, token?.decimals ?? 18),
  });

  const output = useMemo(() => {
    return typedValue;
  }, [typedValue]);

  const { convertParams } = useConvertParams();

  const gasSettings = useMemo(() => {
    return getGasSettings({
      baseFee,
      chainId,
      gasPrice,
      priorityFee,
      gasPriceOption,
      gasPriceSettings,
    });
  }, [baseFee, chainId, gasPrice, priorityFee, gasPriceOption, gasPriceSettings]);

  const handleConvert = useCallback(
    async (amountToApprove: string) => {
      if (!publicClient || !token) {
        return;
      }

      if (!isAllowedA && tokenStandard === Standard.ERC20) {
        setStatus(ConvertStatus.PENDING_APPROVE);
        const result = await approveA({
          customAmount: parseUnits(amountToApprove, token?.decimals ?? 18),
          customGasSettings: gasSettings,
        });

        if (!result?.success) {
          setStatus(ConvertStatus.INITIAL);
          return;
        } else {
          setApproveHash(result.hash);
          setStatus(ConvertStatus.LOADING_APPROVE);

          const approveReceipt = await publicClient.waitForTransactionReceipt({
            hash: result.hash,
          });

          if (approveReceipt.status === "reverted") {
            setStatus(ConvertStatus.ERROR_APPROVE);
            return;
          }
        }
      }

      if (
        !walletClient ||
        !address ||
        !token ||
        !convertParams ||
        typeof output == null
        // !estimatedGas
      ) {
        console.log({
          walletClient,
          address,
          token,
          output,
          publicClient,
          chainId,
          convertParams,
        });
        return;
      }

      setStatus(ConvertStatus.PENDING_CONVERT);

      let hash;

      try {
        const estimatedGas = await publicClient.estimateContractGas({
          account: address,
          ...convertParams,
        } as any);

        const gasToUse = customGasLimit ? customGasLimit : estimatedGas + BigInt(30000); // set custom gas here if user changed it

        let _request;
        try {
          const { request, result } = await publicClient.simulateContract({
            ...convertParams,
            account: address,
            ...gasSettings,
            gas: gasToUse,
          } as any);
          console.log("Swap simulation result:", result);
          _request = request;
        } catch (e) {
          _request = {
            ...convertParams,
            ...gasSettings,
            gas: gasToUse,
            account: undefined,
          } as any;
        }

        hash = await walletClient.writeContract({
          ..._request,
          account: undefined,
        });

        if (hash) {
          setConvertHash(hash);
          setStatus(ConvertStatus.LOADING_CONVERT);

          const transaction = await getTransactionWithRetries({ hash, publicClient });
          if (transaction) {
            const receipt = await publicClient.waitForTransactionReceipt({ hash }); //TODO: add try catch
            updateAllowance();
            if (receipt.status === "success") {
              setStatus(ConvertStatus.SUCCESS);
            }

            if (receipt.status === "reverted") {
              setStatus(ConvertStatus.ERROR_CONVERT);

              const ninetyEightPercent = (gasToUse * BigInt(98)) / BigInt(100);

              if (receipt.gasUsed >= ninetyEightPercent && receipt.gasUsed <= gasToUse) {
                setErrorType(ConvertError.OUT_OF_GAS);
              } else {
                setErrorType(ConvertError.UNKNOWN);
              }
            }
          }
        } else {
          setStatus(ConvertStatus.INITIAL);
        }
      } catch (e) {
        console.log(e);
        addToast("Error while executing contract", "error");
        setStatus(ConvertStatus.INITIAL);
      }
    },
    [
      address,
      approveA,
      chainId,
      convertParams,
      customGasLimit,
      gasSettings,
      isAllowedA,
      output,
      publicClient,
      setApproveHash,
      setErrorType,
      setConvertHash,
      setStatus,
      token,
      tokenStandard,
      updateAllowance,
      walletClient,
    ],
  );

  return {
    handleConvert,
    isAllowedA: isAllowedA,
    handleApprove: () => null,
  };
}
