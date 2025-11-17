import clsx from "clsx";
import { useFormik } from "formik";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { formatEther, formatGwei, parseGwei } from "viem";

import { baseFeeMultipliers, SCALING_FACTOR } from "@/config/baseFeeMultipliers";
import { isEip1559Supported } from "@/config/eip1559";
import { DexChainId } from "@/config/networks.config";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import useDeepEffect from "@/hooks/useDeepEffect";
import { useGlobalFees } from "@/hooks/useGlobalFees";
import { useNativeCurrency } from "@/hooks/useNativeCurrency";
import { GasFeeModel, GasOption, GasSettings } from "@/stores/factories/createGasPriceStore";
import addToast from "@/utils/addToast";
import { formatFloat } from "@/utils/formatFloat";

import Alert from "../atoms/Alert";
import Button, { ButtonColor } from "../atoms/Button";
import DialogHeader from "../atoms/DialogHeader";
import DrawerDialog from "../atoms/DrawerDialog";
import Switch from "../atoms/Switch";
import Tooltip from "../atoms/Tooltip";
import ConfigureAutomatically from "../gas-settings/ConfigureAutomatically";
import EIP1559Fields from "../gas-settings/EIP1559Fields";
import GasLimitField from "../gas-settings/GasLimitField";
import GasOptionRadioButton from "../gas-settings/GasOptionRadioButton";
import useNetworkFeeGasValidation from "../gas-settings/hooks/useNetworkFeeGasValidation";
import LegacyField from "../gas-settings/LegacyField";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  isAdvanced: boolean;
  setIsAdvanced: (isAdvanced: boolean) => void;

  gasPriceOption: GasOption;
  gasPriceSettings: GasSettings;
  setGasPriceOption: (gasOption: GasOption) => void;
  setGasPriceSettings: (gasSettings: GasSettings) => void;

  customGasLimit: bigint | undefined;
  estimatedGas: bigint;
  setCustomGasLimit: (customGas: bigint | undefined) => void;
  setEstimatedGas: (estimatedGas: bigint) => void;
}

const gasOptionTitle: Record<GasOption, string> = {
  [GasOption.CHEAP]: "Cheaper",
  [GasOption.FAST]: "Faster",
  [GasOption.CUSTOM]: "Custom",
};

const gasOptionIcon: Record<GasOption, "cheap-gas" | "fast-gas" | "custom-gas"> = {
  [GasOption.CHEAP]: "cheap-gas",
  [GasOption.FAST]: "fast-gas",
  [GasOption.CUSTOM]: "custom-gas",
};

const gasOptions = [GasOption.CHEAP, GasOption.FAST, GasOption.CUSTOM];

function getInitialCustomValue(
  initialOption: GasOption,
  estimatedValue: bigint | undefined,
  initialValue: bigint | undefined,
  chainId: DexChainId,
) {
  if (initialOption === GasOption.CUSTOM && initialValue) {
    return formatGwei(initialValue);
  }

  if (estimatedValue) {
    return formatGwei(
      (estimatedValue * baseFeeMultipliers[chainId][GasOption.CHEAP]) / SCALING_FACTOR,
    );
  }
  return "";
}

type HandleApplyArgs =
  | { option: GasOption.CHEAP }
  | { option: GasOption.FAST }
  | { option: GasOption.CUSTOM; gasSettings: GasSettings; gasLimit: bigint };

const tooltipTextMap: Record<GasOption, string> = {
  [GasOption.CHEAP]:
    "GAS values will be set to minimize the fee you are going to pay. It might result in the transaction being pending for longer before confirming.",
  [GasOption.CUSTOM]: "With custom transaction configuration you can set the gas values manually.",
  [GasOption.FAST]:
    "GAS values will be set to minimize the amount of time your transaction will take to confirm. It might result in higher gas fee payment.",
};

function NetworkFeeDialogContent({
  isAdvanced,
  setIsOpen,
  gasPriceOption,
  gasPriceSettings,
  setGasPriceSettings,
  setGasPriceOption,
  estimatedGas,
  customGasLimit,
  setCustomGasLimit,
}: Omit<Props, "isOpen" | "setIsAdvanced">) {
  const chainId = useCurrentChainId();

  const { baseFee, priorityFee, gasPrice } = useGlobalFees();

  useDeepEffect(() => {
    if (gasPriceOption === GasOption.CHEAP) {
      if (gasPriceSettings.model === GasFeeModel.EIP1559) {
        if (
          !gasPriceSettings.maxFeePerGas &&
          baseFee &&
          !gasPriceSettings.maxPriorityFeePerGas &&
          priorityFee
        ) {
          const multiplier = baseFeeMultipliers[chainId][GasOption.CHEAP];

          setGasPriceSettings({
            model: GasFeeModel.EIP1559,
            maxFeePerGas: (baseFee * multiplier) / SCALING_FACTOR,
            maxPriorityFeePerGas: (priorityFee * multiplier) / SCALING_FACTOR,
          });
        }
      }

      if (gasPriceSettings.model === GasFeeModel.LEGACY) {
        if (!gasPriceSettings.gasPrice && gasPrice) {
          const multiplier = baseFeeMultipliers[chainId][GasOption.CHEAP];

          setGasPriceSettings({
            model: GasFeeModel.LEGACY,
            gasPrice: (gasPrice * multiplier) / SCALING_FACTOR,
          });
        }
      }
    }
  }, [baseFee, priorityFee]);

  const handleApply = useCallback(
    (args: HandleApplyArgs) => {
      if ((!baseFee || !priorityFee) && !gasPrice) {
        return;
      }

      const { option } = args;

      setGasPriceOption(option);

      if (option === GasOption.CUSTOM) {
        setGasPriceSettings(args.gasSettings);
      }
    },
    [baseFee, gasPrice, priorityFee, setGasPriceOption, setGasPriceSettings],
  );

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (baseFee && priorityFee && gasPrice) {
      if (
        gasPriceSettings.model === GasFeeModel.EIP1559 &&
        gasPriceSettings.maxFeePerGas &&
        gasPriceSettings.maxPriorityFeePerGas
      ) {
        setIsInitialized(true);
      }
      if (gasPriceSettings.model === GasFeeModel.LEGACY && gasPriceSettings.gasPrice) {
        setIsInitialized(true);
      }
    }
  }, [gasPrice, priorityFee, baseFee, gasPriceSettings]);

  const nativeCurrency = useNativeCurrency();

  const formik = useFormik({
    enableReinitialize: !isInitialized,
    initialValues: {
      maxFeePerGas: getInitialCustomValue(
        gasPriceOption,
        baseFee,
        gasPriceSettings.model === GasFeeModel.EIP1559 ? gasPriceSettings.maxFeePerGas : undefined,
        chainId,
      ),
      maxPriorityFeePerGas: getInitialCustomValue(
        gasPriceOption,
        priorityFee,
        gasPriceSettings.model === GasFeeModel.EIP1559
          ? gasPriceSettings.maxPriorityFeePerGas
          : undefined,
        chainId,
      ),
      gasPrice: getInitialCustomValue(
        gasPriceOption,
        gasPrice,
        gasPriceSettings.model === GasFeeModel.LEGACY ? gasPriceSettings.gasPrice : undefined,
        chainId,
      ),
      gasPriceOption,
      gasPriceModel: gasPriceSettings.model,
      gasLimit: customGasLimit ? customGasLimit.toString() : estimatedGas.toString(),
    },
    onSubmit: (values, formikHelpers) => {
      if (values.gasPriceOption !== GasOption.CUSTOM) {
        handleApply({ option: values.gasPriceOption });
      } else {
        if (values.gasPriceModel === GasFeeModel.EIP1559) {
          handleApply({
            option: GasOption.CUSTOM,
            gasSettings: {
              model: GasFeeModel.EIP1559,
              maxFeePerGas: parseGwei(values.maxFeePerGas),
              maxPriorityFeePerGas: parseGwei(values.maxPriorityFeePerGas),
            },
            gasLimit: BigInt(values.gasLimit),
          });
        } else {
          if (values.gasPriceModel === GasFeeModel.LEGACY) {
            handleApply({
              option: GasOption.CUSTOM,
              gasSettings: {
                model: GasFeeModel.LEGACY,
                gasPrice: parseGwei(values.gasPrice),
              },
              gasLimit: BigInt(values.gasLimit),
            });
          }
        }

        if (isAdvanced) {
          setCustomGasLimit(BigInt(values.gasLimit));
        }
      }

      setIsOpen(false);
      addToast("Settings applied");
    },
  });

  const { handleChange, handleBlur, touched, values, setFieldValue, handleSubmit, handleReset } =
    formik;

  const {
    maxFeePerGasError,
    maxFeePerGasWarning,
    maxPriorityFeePerGasError,
    maxPriorityFeePerGasWarning,
    legacyGasPriceError,
    legacyGasPriceWarning,
    gasLimitError,
  } = useNetworkFeeGasValidation({
    maxFeePerGas: values.maxFeePerGas,
    maxPriorityFeePerGas: values.maxPriorityFeePerGas,
    gasPrice: values.gasPrice,
    gasLimit: values.gasLimit,
    estimatedGas,
  });

  const getGasPriceGwei = useCallback(
    (_gasOption: GasOption) => {
      if (_gasOption === GasOption.CUSTOM && (baseFee || gasPrice)) {
        if (values.gasPriceModel === GasFeeModel.LEGACY) {
          return parseGwei(values.gasPrice);
        }

        if (values.gasPriceModel === GasFeeModel.EIP1559) {
          return parseGwei(values.maxFeePerGas);
        }
      }

      if (_gasOption !== GasOption.CUSTOM && (baseFee || gasPrice)) {
        if (values.gasPriceModel === GasFeeModel.EIP1559 && baseFee) {
          return (baseFee * baseFeeMultipliers[chainId][_gasOption]) / SCALING_FACTOR;
        }

        if (gasPrice) {
          return (gasPrice * baseFeeMultipliers[chainId][_gasOption]) / SCALING_FACTOR;
        }
      }

      return BigInt(0);
    },
    [baseFee, chainId, gasPrice, values.gasPrice, values.gasPriceModel, values.maxFeePerGas],
  );

  return (
    <form className="max-md:h-[calc(100%-60px)]" onSubmit={handleSubmit}>
      <div className="max-md:h-[calc(100%-80px)] overflow-auto flex flex-col gap-2 card-spacing-x">
        {gasOptions.map((_gasOption) => {
          const gasPriceETH = formatFloat(formatEther(getGasPriceGwei(_gasOption) * estimatedGas));

          return (
            <GasOptionRadioButton
              key={_gasOption}
              gasPriceGWEI={`${formatFloat(formatGwei(getGasPriceGwei(_gasOption)))} GWEI`}
              gasPriceCurrency={`${gasPriceETH} ${nativeCurrency.symbol}`}
              tooltipText={tooltipTextMap[_gasOption]}
              title={gasOptionTitle[_gasOption]}
              iconName={gasOptionIcon[_gasOption]}
              customContent={
                _gasOption === GasOption.CUSTOM ? (
                  <div
                    className={clsx(
                      values.gasPriceOption !== GasOption.CUSTOM &&
                        "opacity-30 pointer-events-none",
                    )}
                  >
                    {!isAdvanced && isEip1559Supported(chainId) && (
                      <div className={clsx("px-5 pb-4")}>
                        <ConfigureAutomatically
                          gasPriceModel={values.gasPriceModel}
                          setFieldValue={setFieldValue}
                        />
                        <EIP1559Fields
                          maxPriorityFeePerGas={values.maxPriorityFeePerGas}
                          maxFeePerGas={values.maxFeePerGas}
                          setMaxFeePerGasValue={(value) => setFieldValue("maxFeePerGas", value)}
                          setMaxPriorityFeePerGasValue={(value) =>
                            setFieldValue("maxPriorityFeePerGas", value)
                          }
                          currentMaxFeePerGas={baseFee}
                          currentMaxPriorityFeePerGas={priorityFee}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          maxFeePerGasError={maxFeePerGasError}
                          maxFeePerGasWarning={maxFeePerGasWarning}
                          maxPriorityFeePerGasError={maxPriorityFeePerGasError}
                          maxPriorityFeePerGasWarning={maxPriorityFeePerGasWarning}
                        />
                      </div>
                    )}

                    {!isAdvanced && !isEip1559Supported(chainId) && (
                      <div className={clsx("px-5 pb-4")}>
                        <ConfigureAutomatically
                          gasPriceModel={values.gasPriceModel}
                          setFieldValue={setFieldValue}
                        />
                        <LegacyField
                          value={values.gasPrice}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={(e) => {
                            handleBlur(e);
                          }}
                          gasPrice={gasPrice}
                          setFieldValue={(value) => setFieldValue("gasPrice", value)}
                          legacyGasPriceError={legacyGasPriceError}
                          legacyGasPriceWarning={legacyGasPriceWarning}
                        />
                      </div>
                    )}

                    {isAdvanced && !isEip1559Supported(chainId) && (
                      <div className={clsx("px-5 pb-4 flex flex-col gap-4")}>
                        <ConfigureAutomatically
                          gasPriceModel={values.gasPriceModel}
                          setFieldValue={setFieldValue}
                        />
                        <LegacyField
                          value={values.gasPrice}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={(e) => {
                            handleBlur(e);
                          }}
                          gasPrice={gasPrice}
                          setFieldValue={(value) => setFieldValue("gasPrice", value)}
                          legacyGasPriceError={legacyGasPriceError}
                          legacyGasPriceWarning={legacyGasPriceWarning}
                        />

                        <GasLimitField
                          onChange={(e) => setFieldValue("gasLimit", e.target.value)}
                          onBlur={(e) => handleBlur(e)}
                          setFieldValue={(value) => setFieldValue("gasLimit", value)}
                          value={values.gasLimit}
                          estimatedGas={estimatedGas}
                          gasLimitError={gasLimitError}
                        />
                      </div>
                    )}

                    {isAdvanced && isEip1559Supported(chainId) && (
                      <div className="px-5 pb-4">
                        <ConfigureAutomatically
                          gasPriceModel={values.gasPriceModel}
                          setFieldValue={setFieldValue}
                        />
                        <div className="pb-5">
                          <div className="grid grid-cols-2 gap-1 p-1 rounded-3 bg-secondary-bg mb-4">
                            <button
                              type="button"
                              className={clsx(
                                values.gasPriceModel === GasFeeModel.EIP1559
                                  ? "bg-green-bg border-green"
                                  : "bg-primary-bg border-transparent",
                                "flex flex-col gap-1 justify-center group/button items-center py-3 px-5 border group  rounded-3 duration-200",
                                "hover:bg-green-bg",
                              )}
                              onClick={() => setFieldValue("gasPriceModel", GasFeeModel.EIP1559)}
                            >
                              <span
                                className={clsx(
                                  "flex items-center gap-1",
                                  values.gasPriceModel !== GasFeeModel.EIP1559 &&
                                    "text-secondary-text",
                                )}
                              >
                                EIP-1559
                                <Tooltip text="There are two types of transactions: EIP-1559 and legacy. The type of transaction affects the formula for gas payments calculation. EIP-1559 transactions are recommended for networks and wallets that have it supported." />
                              </span>
                              <span
                                className={clsx(
                                  "text-12 duration-200",
                                  values.gasPriceModel === GasFeeModel.EIP1559
                                    ? "text-secondary-text "
                                    : "text-tertiary-text group-hover/button:text-secondary-text",
                                )}
                              >
                                Network Fee = gasLimit × (Base Fee + PriorityFee)
                              </span>
                            </button>
                            <button
                              type="button"
                              className={clsx(
                                values.gasPriceModel === GasFeeModel.LEGACY
                                  ? "bg-green-bg border-green"
                                  : "bg-primary-bg border-transparent",
                                "flex flex-col gap-1 justify-center group/button items-center py-3 px-5 border group  rounded-3 duration-200",
                                "hover:bg-green-bg",
                              )}
                              onClick={() => setFieldValue("gasPriceModel", GasFeeModel.LEGACY)}
                            >
                              <span
                                className={clsx(
                                  "flex items-center gap-1",
                                  values.gasPriceModel !== GasFeeModel.LEGACY &&
                                    "text-secondary-text",
                                )}
                              >
                                Legacy{" "}
                                <Tooltip text="There are two types of transactions: EIP-1559 and legacy. The type of transaction affects the formula for gas payments calculation. Legacy transactions allow you to determine the exact gasPrice you are going to pay. EIP-1559 transactions are recommended for networks that support it." />
                              </span>
                              <span
                                className={clsx(
                                  "text-12 duration-200",
                                  values.gasPriceModel === GasFeeModel.LEGACY
                                    ? "text-secondary-text "
                                    : "text-tertiary-text group-hover/button:text-secondary-text",
                                )}
                              >
                                Network Fee = gasLimit × gasPrice
                              </span>
                            </button>
                          </div>
                          {values.gasPriceModel === GasFeeModel.EIP1559 && (
                            <>
                              <EIP1559Fields
                                maxPriorityFeePerGas={values.maxPriorityFeePerGas}
                                maxFeePerGas={values.maxFeePerGas}
                                setMaxFeePerGasValue={(value) =>
                                  setFieldValue("maxFeePerGas", value)
                                }
                                setMaxPriorityFeePerGasValue={(value) =>
                                  setFieldValue("maxPriorityFeePerGas", value)
                                }
                                currentMaxFeePerGas={baseFee}
                                currentMaxPriorityFeePerGas={priorityFee}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                maxFeePerGasError={maxFeePerGasError}
                                maxFeePerGasWarning={maxFeePerGasWarning}
                                maxPriorityFeePerGasError={maxPriorityFeePerGasError}
                                maxPriorityFeePerGasWarning={maxPriorityFeePerGasWarning}
                              />
                              <div className="mt-5">
                                <Alert
                                  text="Сhanging Priority Fee only in order to make transaction cheaper or speed it up at a cost of paying higher fee."
                                  type="info-border"
                                />
                              </div>
                            </>
                          )}
                          {values.gasPriceModel === GasFeeModel.LEGACY && (
                            <div className="mt-4">
                              <LegacyField
                                value={values.gasPrice}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                onBlur={(e) => {
                                  handleBlur(e);
                                }}
                                gasPrice={gasPrice}
                                setFieldValue={(value) => setFieldValue("gasPrice", value)}
                                legacyGasPriceError={legacyGasPriceError}
                                legacyGasPriceWarning={legacyGasPriceWarning}
                              />
                            </div>
                          )}
                        </div>
                        <GasLimitField
                          onChange={(e) => setFieldValue("gasLimit", e.target.value)}
                          onBlur={(e) => handleBlur(e)}
                          setFieldValue={(value) => setFieldValue("gasLimit", value)}
                          value={values.gasLimit}
                          estimatedGas={estimatedGas}
                          gasLimitError={gasLimitError}
                        />
                      </div>
                    )}
                  </div>
                ) : undefined
              }
              isActive={values.gasPriceOption === _gasOption}
              onClick={() => setFieldValue("gasPriceOption", _gasOption)}
            />
          );
        })}
      </div>

      <div className="px-4 mb-4 md:px-10 md:mb-10 pt-4 grid grid-cols-2 gap-3">
        <Button
          type="button"
          fullWidth
          onClick={handleCancel}
          colorScheme={ButtonColor.LIGHT_GREEN}
        >
          Cancel
        </Button>
        <Button
          disabled={Boolean(
            (!isAdvanced &&
              (maxFeePerGasError || maxPriorityFeePerGasError) &&
              values.gasPriceOption === GasOption.CUSTOM &&
              values.gasPriceModel === GasFeeModel.EIP1559) ||
              gasLimitError ||
              (!isAdvanced &&
                values.gasPriceOption === GasOption.CUSTOM &&
                values.gasPriceModel === GasFeeModel.LEGACY &&
                legacyGasPriceError),
          )}
          type="submit"
          fullWidth
        >
          Apply
        </Button>
      </div>
    </form>
  );
}
export default function NetworkFeeConfigDialog({
  isOpen,
  setIsOpen,
  isAdvanced,
  setIsAdvanced,
  ...props
}: Props) {
  const [containerHeight, setContainerHeight] = useState("auto"); // Default to auto height
  const ref = useRef<HTMLDivElement>(null);
  // Function to check and adjust the container height based on the content

  // Run adjustHeight on window resize or on initial load
  useEffect(() => {
    if (!ref.current) return;

    const adjustHeight = () => {
      const contentHeight = ref.current?.scrollHeight; // Get the height of the content
      if (!contentHeight) {
        return;
      }

      const viewportHeight = window.innerHeight;

      // Set container height to 100vh only if content exceeds the viewport height
      if (contentHeight > viewportHeight && window.innerWidth < 768) {
        setContainerHeight("100dvh");
      } else {
        setContainerHeight("auto");
      }
    };

    adjustHeight();
    const debouncedAdjustHeight = debounce(adjustHeight, 300);

    window.addEventListener("resize", debouncedAdjustHeight);

    // Cleanup function to remove the listener and cancel debounce
    return () => {
      window.removeEventListener("resize", debouncedAdjustHeight);
      debouncedAdjustHeight.cancel(); // Cancel any pending invocations of the debounced function
    };
  }, [isAdvanced]);

  return (
    <DrawerDialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <div
        ref={ref}
        className="w-full md:w-[800px] duration-200 overflow-hidden"
        style={{ height: containerHeight }}
      >
        <DialogHeader
          onClose={() => setIsOpen(false)}
          title="Gas settings"
          settings={
            <div className="flex items-center gap-2">
              <span className="text-12">Advanced mode</span>
              <Switch checked={isAdvanced} handleChange={() => setIsAdvanced(!isAdvanced)} />
            </div>
          }
        />
        <NetworkFeeDialogContent {...props} setIsOpen={setIsOpen} isAdvanced={isAdvanced} />
      </div>
    </DrawerDialog>
  );
}
//1170 => 1133 => 797 => 826 => 861 => 714 => 681 => 607
