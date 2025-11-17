import React, { ChangeEvent, useEffect, useMemo } from "react";

import { ThemeColors } from "@/config/theme-colors.config";

import { InputSize } from "../atoms/Input";
import TextField from "../atoms/TextField";
import ErrorsAndWarnings from "./ErrorsAndWarnings";

export default function GasLimitField({
  value,
  setFieldValue,
  onChange,
  onBlur,
  estimatedGas,
  gasLimitError,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  setFieldValue: (value: string) => void;
  estimatedGas: bigint;
  gasLimitError: string | undefined;
}) {
  const gasLimitErrors = useMemo(() => {
    const _errors: string[] = [];

    [gasLimitError].forEach((v) => {
      if (v) {
        _errors.push(v);
      }
    });

    return _errors;
  }, [gasLimitError]);

  return (
    <>
      <TextField
        isNumeric
        decimalScale={0}
        placeholder="Gas limit"
        label="Gas limit"
        name="gasLimit"
        id="gasLimit"
        tooltipText="The amount of fee that you are going to pay is calculated as (baseFee + priorityFee) * gasUsed.

Gas Limit sets the upper bound for gasUsed variable in this formula. If your transaction will consume less gas than the Gas Limit then you will only pay for the gas required for your transaction to submit and the rest will be refunded.

Setting a low Gas Limit may result in transaction failure if the amount of actions triggered by this transaction require more gas than specified with Gas Limit."
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        isError={!!gasLimitError}
        helperText={
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                setFieldValue(estimatedGas ? estimatedGas.toString() : "100000");
              }}
              className="text-green duration-200 hover:text-green-hover"
            >
              Estimated
            </button>{" "}
            {estimatedGas ? estimatedGas?.toString() : 100000} Gwei
          </div>
        }
        inputSize={InputSize.DEFAULT}
      />
      <ErrorsAndWarnings errors={gasLimitErrors} />
    </>
  );
}
