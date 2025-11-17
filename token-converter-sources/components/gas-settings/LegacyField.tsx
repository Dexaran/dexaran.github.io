import React, { ChangeEvent, useMemo } from "react";
import { formatGwei } from "viem";

import { formatFloat } from "@/utils/formatFloat";

import { InputSize } from "../atoms/Input";
import TextField from "../atoms/TextField";
import ErrorsAndWarnings from "./ErrorsAndWarnings";

export default function LegacyField({
  value,
  onChange,
  onBlur,
  gasPrice,
  setFieldValue,
  legacyGasPriceError,
  legacyGasPriceWarning,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  gasPrice: bigint | undefined;
  setFieldValue: (value: string) => void;
  legacyGasPriceError: string | undefined;
  legacyGasPriceWarning: string | undefined;
}) {
  const legacyGasPriceErrors = useMemo(() => {
    const _errors: string[] = [];

    [legacyGasPriceError].forEach((v) => {
      if (v) {
        _errors.push(v);
      }
    });

    return _errors;
  }, [legacyGasPriceError]);

  const legacyGasPriceWarnings = useMemo(() => {
    const _warnings: string[] = [];

    [legacyGasPriceWarning].forEach((v) => {
      if (v) {
        _warnings.push(v);
      }
    });

    return _warnings;
  }, [legacyGasPriceWarning]);

  return (
    <>
      <TextField
        isNumeric
        placeholder="Gas price"
        label="Gas price"
        name="gasPrice"
        id="gasPrice"
        tooltipText=" The amount of fee that you are going to pay with legacy transaction is calculated as gasPrice * gasUsed.

Your transaction will not confirm until your gasPrice is higher or equal to the gas price of the network in the last block.
"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        helperText={
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (gasPrice) {
                  setFieldValue(formatGwei(gasPrice));
                }
              }}
              className="text-green duration-200 hover:text-green-hover"
            >
              Current
            </button>{" "}
            {gasPrice ? formatFloat(formatGwei(gasPrice)) : "0"} Gwei
          </div>
        }
        inputSize={InputSize.DEFAULT}
      />
      <ErrorsAndWarnings errors={legacyGasPriceErrors} warnings={legacyGasPriceWarnings} />
    </>
  );
}
