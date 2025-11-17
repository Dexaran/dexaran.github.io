import clsx from "clsx";
import React, { ReactNode } from "react";

import { IconName } from "@/types/IconName";

import Svg from "../atoms/Svg";
import Tooltip from "../atoms/Tooltip";

interface Props {
  gasPriceGWEI: string | undefined;
  gasPriceCurrency: string;
  tooltipText: string;
  title: string;
  iconName: Extract<IconName, "cheap-gas" | "custom-gas" | "fast-gas" | "auto-increase">;
  customContent?: ReactNode;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}
export default function GasOptionRadioButton({
  onClick,
  gasPriceGWEI,
  gasPriceCurrency,
  tooltipText,
  title,
  iconName,
  customContent,
  isActive,
  disabled,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "w-full rounded-3 bg-tertiary-bg group cursor-pointer",
        isActive && "cursor-auto",
        disabled && "pointer-events-none",
      )}
    >
      <div
        className={clsx(
          "flex justify-between px-5 items-center min-h-12 md:min-h-[60px] duration-200",
          !!customContent
            ? "border-primary-bg rounded-t-3 border-b"
            : "border-primary-bg rounded-3",
          !isActive && "group-hover:bg-green-bg",
          disabled && "opacity-50",
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              "w-4 h-4 duration-200 before:duration-200 border bg-secondary-bg rounded-full before:w-2.5 before:h-2.5 before:absolute before:top-1/2 before:rounded-full before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 relative",
              isActive
                ? "border-green before:bg-green"
                : "border-secondary-border group-hover:border-green",
            )}
          />

          <span
            className={clsx(
              isActive ? "text-green" : "text-tertiary-text group-hover:text-primary-text",
              "duration-200",
            )}
          >
            <Svg iconName={iconName} />
          </span>
          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  isActive
                    ? "text-primary-text"
                    : "text-secondary-text group-hover:text-primary-text",
                  "duration-200 font-bold text-14 md:text-16",
                )}
              >
                {title}
              </span>

              <span className="text-tertiary-text">
                <Tooltip iconSize={20} text={tooltipText} />
              </span>
            </div>
            {/*<span*/}
            {/*  className={clsx(*/}
            {/*    isActive*/}
            {/*      ? "text-secondary-text"*/}
            {/*      : "text-tertiary-text group-hover:text-secondary-text",*/}
            {/*    "duration-200 text-12 md:text-16",*/}
            {/*  )}*/}
            {/*>*/}
            {/*  {gasPriceUSD}*/}
            {/*</span>*/}
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span
            className={clsx(
              isActive ? "text-primary-text" : "text-secondary-text group-hover:text-primary-text",
              "duration-200  text-12 md:text-16",
            )}
          >
            {gasPriceCurrency}
          </span>
          <span
            className={clsx(
              isActive ? "text-tertiary-text" : "text-tertiary-text",
              "duration-200  text-12 md:text-14",
            )}
          >
            {gasPriceGWEI}
          </span>
        </div>
      </div>
      {customContent}
    </div>
  );
}
