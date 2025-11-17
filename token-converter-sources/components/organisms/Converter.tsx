"use client";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Address,
  formatEther,
  formatGwei,
  formatUnits,
  isAddress,
  parseGwei,
  parseUnits,
} from "viem";

import { baseFeeMultipliers, SCALING_FACTOR } from "@/config/baseFeeMultipliers";
import { Standard } from "@/config/standard.config";
import { useConvertEstimatedGas } from "@/hooks/useConvert";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import useDerivedTokenInfo from "@/hooks/useDerivedTokenInfo";
import { useGlobalFees } from "@/hooks/useGlobalFees";
import { useNativeCurrency } from "@/hooks/useNativeCurrency";
import useTokenBalances from "@/hooks/useTokenBalances";
import useTokens from "@/hooks/useTokens";
import { GasFeeModel, GasOption } from "@/stores/factories/createGasPriceStore";
import { useConfirmConvertDialogStore } from "@/stores/useConfirmConvertDialogOpened";
import { useConvertAmountStore } from "@/stores/useConvertAmountStore";
import {
  useConvertGasLimitStore,
  useConvertGasModeStore,
  useConvertGasPriceStore,
} from "@/stores/useConvertGasSettingsStore";
import { useConvertTokensStore } from "@/stores/useConvertTokenStore";
import { formatFloat } from "@/utils/formatFloat";

import Button, { ButtonColor, ButtonSize } from "../atoms/Button";
import Svg from "../atoms/Svg";
import TextField from "../atoms/TextField";
import Tooltip from "../atoms/Tooltip";
import NetworkFeeConfigDialog from "../dialogs/NetworkFeeConfigDialog";
import PickTokenDialog from "./PickTokenDialog";
import SelectedTokenInfoItem from "./SelectedTokensInfo";

function StandardCard({ symbol, standard }: { symbol?: string; standard: Standard }) {
  return (
    <div className="pl-5 pr-4 py-2.5 rounded-3 bg-quaternary-bg flex justify-between items-center">
      <div className="flex text-secondary-text text-16 md:text-18 gap-1 items-center">
        <span
          className={
            standard === Standard.ERC20 ? "text-purple font-medium" : "text-green font-semibold"
          }
        >
          {standard}
        </span>{" "}
        {symbol}
      </div>
      <Tooltip
        text={
          standard === Standard.ERC20
            ? 'ERC-20 is a token standard on Ethereum network. It specifies the "version" of the token you are going to use.'
            : 'ERC-223 is an alternative token standard on Ethereum network. It specifies the "version" of the token you are going to use. ERC-223 introduces security improvements and gas optimizations not available with ERC-20.'
        }
      />
    </div>
  );
}

function StandardText({ standard }: { standard: Standard }) {
  return (
    <span className={standard === Standard.ERC20 ? "text-purple " : "text-green font-semibold"}>
      {standard}
    </span>
  );
}

export default function Converter() {
  const chainId = useCurrentChainId();
  const { setIsOpen: setConfirmConvertDialogOpen } = useConfirmConvertDialogStore();
  const { typedValue, setTypedValue } = useConvertAmountStore();
  const { token, tokenStandard, setTokenStandard, setToken, switchStandard } =
    useConvertTokensStore();
  const { balance } = useTokenBalances(token);
  useConvertEstimatedGas();

  const formattedBalance = useMemo(() => {
    if (tokenStandard === Standard.ERC20) {
      return formatFloat(balance?.erc20Balance?.formatted || 0);
    }
    return formatFloat(balance?.erc223Balance?.formatted || 0);
  }, [balance?.erc20Balance?.formatted, balance?.erc223Balance?.formatted, tokenStandard]);

  const isSufficientBalance = useMemo(() => {
    if (
      typedValue &&
      token &&
      tokenStandard === Standard.ERC20 &&
      balance.erc20Balance &&
      balance.erc20Balance.value >= parseUnits(typedValue, token.decimals)
    ) {
      return true;
    }
    return !!(
      typedValue &&
      token &&
      tokenStandard === Standard.ERC223 &&
      balance.erc223Balance &&
      balance.erc223Balance.value >= parseUnits(typedValue, token.decimals)
    );
  }, [balance, token, tokenStandard, typedValue]);

  console.log(balance);

  const [isOpenedFeeSettings, setIsOpenedFeeSettings] = useState<boolean>(false);
  const {
    gasPriceSettings,
    gasPriceOption,
    setGasPriceOption,
    setGasPriceSettings,
    updateDefaultState,
  } = useConvertGasPriceStore();

  useEffect(() => {
    updateDefaultState(chainId);
  }, [chainId, updateDefaultState]);

  const { customGasLimit, estimatedGas, setCustomGasLimit, setEstimatedGas } =
    useConvertGasLimitStore();
  const { isAdvanced, setIsAdvanced } = useConvertGasModeStore();

  const [addressToSearch, setAddressToSearch] = useState("");

  const tokens = useTokens();

  const tokenFromList = useMemo(() => {
    if (!addressToSearch || !tokens) {
      return undefined;
    }

    return tokens.find(
      (t) =>
        t.address0.toLowerCase() === addressToSearch.toLowerCase() ||
        t.address1.toLowerCase() === addressToSearch.toLowerCase(),
    );
  }, [tokens, addressToSearch]);

  const { isLoading, token: derivedToken } = useDerivedTokenInfo({
    tokenAddressToImport: addressToSearch as Address,
    enabled: !!addressToSearch && isAddress(addressToSearch) && !tokenFromList,
  });

  console.log("Loading derived token...", isLoading);

  useEffect(() => {
    const tokenFromSearch = tokenFromList || derivedToken;

    if (addressToSearch && isAddress(addressToSearch) && tokenFromSearch) {
      setToken(tokenFromSearch);
      if (addressToSearch.toLowerCase() === tokenFromSearch.address1.toLowerCase()) {
        setTokenStandard(Standard.ERC223);
      } else {
        setTokenStandard(Standard.ERC20);
      }
    }
  }, [addressToSearch, derivedToken, setToken, setTokenStandard, tokenFromList]);

  const { baseFee, priorityFee, gasPrice } = useGlobalFees();

  const nativeCurrency = useNativeCurrency();

  const getGasPriceGwei = useCallback(() => {
    if (gasPriceOption === GasOption.CUSTOM) {
      if (gasPriceSettings.model === GasFeeModel.LEGACY && gasPrice) {
        return parseGwei(gasPrice.toString());
      }

      if (gasPriceSettings.model === GasFeeModel.EIP1559 && gasPriceSettings.maxFeePerGas) {
        return parseGwei(gasPriceSettings.maxFeePerGas.toString());
      }
    }

    if (gasPriceOption !== GasOption.CUSTOM && (baseFee || gasPrice)) {
      if (gasPriceSettings.model === GasFeeModel.EIP1559 && baseFee) {
        return (baseFee * baseFeeMultipliers[chainId][gasPriceOption]) / SCALING_FACTOR;
      }

      if (gasPrice) {
        return (gasPrice * baseFeeMultipliers[chainId][gasPriceOption]) / SCALING_FACTOR;
      }
    }

    return BigInt(0);
  }, [baseFee, chainId, gasPrice, gasPrice, gasPriceOption, gasPriceSettings]);

  const gasPriceETH = useMemo(() => {
    return formatFloat(formatEther(getGasPriceGwei() * estimatedGas));
  }, [estimatedGas, getGasPriceGwei]);
  const gasPriceGWEI = useMemo(() => {
    return `${formatFloat(formatGwei(getGasPriceGwei()))} GWEI`;
  }, [getGasPriceGwei]);

  const gasPriceCurrency = useMemo(() => {
    return `${gasPriceETH} ${nativeCurrency.symbol}`;
  }, [gasPriceETH, nativeCurrency.symbol]);

  return (
    <div className="max-w-[680px] mx-auto">
      <h1 className="gap-1 text-28 md:text-40 font-medium mb-2 mt-4 md:mt-10 text-center">
        ERC-20 <Svg className="inline" iconName="swap" /> ERC-223 token converter
      </h1>
      <p className="text-secondary-text text-center">
        This is a token converter that converts ERC-20 tokens to ERC-223. It can also convert
        ERC-223 tokens back to ERC-20 at any time. No fees are charged.{" "}
      </p>
      <p className="text-secondary-text text-center mb-3 md:mb-8">
        Read more about the conversion process
      </p>

      <div className="card-spacing-x card-spacing-y rounded-5 bg-primary-bg flex flex-col gap-4">
        <div className="bg-tertiary-bg px-4 md:px-5 py-3 rounded-3">
          <h2 className="text-16 md:text-20 font-medium mb-1">Select token to convert</h2>
          <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
            <PickTokenDialog
              onPick={() => {
                setAddressToSearch("");
              }}
            />
          </div>
          <div className="relative mt-1 flex justify-center before:absolute before:left-0 before:h-px before:w-full before:top-1/2 before:-translate-y-1/2 before:bg-secondary-border">
            <span className="block bg-tertiary-bg px-2 relative z-10 text-tertiary-text">OR</span>
          </div>
          <TextField
            value={addressToSearch}
            onChange={(e) => {
              setAddressToSearch(e.target.value);
            }}
            label=""
            placeholder="Enter token contract address"
          />
        </div>
        <div
          className={clsx(
            "bg-tertiary-bg flex flex-col md:grid md:grid-cols-[1fr_48px_1fr] rounded-3 px-4 md:px-5  pb-4 md:pb-5 pt-3 gap-6 md:gap-3 relative",
            isLoading && "opacity-50 pointer-events-none",
          )}
        >
          <div>
            <p className="mb-1 text-16 md:text-20  font-medium">You send</p>
            <StandardCard symbol={token?.symbol} standard={tokenStandard} />
          </div>
          <div className="flex items-end max-md:absolute max-md:top-1/2 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-[9px]">
            <button
              onClick={switchStandard}
              className="bg-secondary-bg w-10 md:w-12 h-10 md:h-12 flex items-center justify-center rounded-3 text-green hover:text-[#A5E7E6] cursor-pointer duration-200"
            >
              <Svg iconName="swap" />
            </button>
          </div>
          <div>
            <p className="mb-1 text-16 md:text-20 font-medium">You receive</p>
            <StandardCard
              symbol={token?.symbol}
              standard={tokenStandard === Standard.ERC20 ? Standard.ERC223 : Standard.ERC20}
            />
          </div>
        </div>

        <div
          className={clsx(
            "bg-tertiary-bg rounded-3 px-4 md:px-5  py-3",
            isLoading && "opacity-50 pointer-events-none",
          )}
        >
          <div className="flex justify-between items-center">
            <p className="text-16 md:text-20 font-medium">Enter amount</p>
            <Button
              size={ButtonSize.EXTRA_SMALL}
              colorScheme={ButtonColor.LIGHT_GREEN}
              onClick={() => {
                if (balance.erc20Balance && tokenStandard === Standard.ERC20) {
                  setTypedValue({
                    typedValue: formatUnits(balance.erc20Balance.value, token?.decimals ?? 18),
                  });
                }

                if (balance.erc223Balance && tokenStandard === Standard.ERC223) {
                  setTypedValue({
                    typedValue: formatUnits(balance.erc223Balance.value, token?.decimals ?? 18),
                  });
                }
              }}
            >
              Max
            </Button>
          </div>
          <TextField
            value={typedValue}
            onChange={(e) => {
              setTypedValue({ typedValue: e.target.value });
            }}
            internalText={token?.symbol}
            label=""
            placeholder="0"
            helperText={
              token ? (
                <span>
                  <span className="text-tertiary-text">Balance:</span> {formattedBalance}{" "}
                  {token.symbol || "Unknown"}
                </span>
              ) : (
                ""
              )
            }
          />
        </div>

        <div
          className={clsx(
            "bg-tertiary-bg rounded-3 border border-blue px-4 md:px-5  py-3 flex items-center gap-2",
            isLoading && "opacity-50 pointer-events-none",
          )}
        >
          <Svg className="text-blue shrink-0" iconName="convert" />
          <p>
            You are converting your <StandardText standard={tokenStandard} /> tokens to{" "}
            <StandardText
              standard={tokenStandard === Standard.ERC20 ? Standard.ERC223 : Standard.ERC20}
            />{" "}
            tokens
          </p>
        </div>

        <div
          className={clsx(
            "bg-tertiary-bg rounded-3 overflow-hidden",
            isLoading && "opacity-50 pointer-events-none",
          )}
        >
          <button
            onClick={() => setIsOpenedFeeSettings(!isOpenedFeeSettings)}
            className="w-full min-h-12 flex items-center justify-between px-4 md:px-5 py-2.5  hover:bg-green-bg cursor-pointer duration-200"
          >
            <span className="flex items-center gap-x-2 max-md: flex-wrap">
              <Tooltip
                iconSize={20}
                text="Network fee is charged when you send any transaction on {networkName} network. It is paid in the networks native currency (i.e. ETH on Ethereum)."
              />
              <span className="text-secondary-text block mr-1">Network fee</span>
              <div className="flex items-center gap-x-2">
                <span>{gasPriceCurrency}</span>
                <div className="w-px h-4 bg-primary-border" />
                <span className="text-tertiary-text">{gasPriceGWEI}</span>
              </div>
            </span>{" "}
            <Svg iconName="small-expand-arrow" />
          </button>
        </div>

        <Button
          disabled={isLoading || !typedValue || !isSufficientBalance}
          fullWidth
          onClick={() => setConfirmConvertDialogOpen(true)}
        >
          {!isLoading ? (
            <>
              {!typedValue ? (
                "Enter amount"
              ) : (
                <>
                  {" "}
                  {isSufficientBalance ? (
                    <>
                      Convert {token?.symbol} to{" "}
                      {tokenStandard === Standard.ERC223 ? "ERC-20" : "ERC-223"}
                    </>
                  ) : (
                    "Insufficient balance"
                  )}
                </>
              )}
            </>
          ) : (
            "Loading..."
          )}
        </Button>
      </div>

      <div className="mt-3 md:mt-8">
        <p className="mb-1 font-bold">Token contract addresses</p>
        {token && <SelectedTokenInfoItem token={token} />}
      </div>
      <NetworkFeeConfigDialog
        isAdvanced={isAdvanced}
        setIsAdvanced={setIsAdvanced}
        estimatedGas={estimatedGas}
        setEstimatedGas={setEstimatedGas}
        gasPriceSettings={gasPriceSettings}
        gasPriceOption={gasPriceOption}
        customGasLimit={customGasLimit}
        setCustomGasLimit={setCustomGasLimit}
        setGasPriceOption={setGasPriceOption}
        setGasPriceSettings={setGasPriceSettings}
        isOpen={isOpenedFeeSettings}
        setIsOpen={setIsOpenedFeeSettings}
      />
    </div>
  );
}
