import clsx from "clsx";
import { ButtonHTMLAttributes, ForwardedRef, forwardRef, PropsWithChildren } from "react";

import { ThemeColors } from "@/config/theme-colors.config";
import { clsxMerge } from "@/utils/clsxMerge";

import Svg from "./Svg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  withArrow?: boolean;
  isOpen?: boolean;
  size?: "regular" | "medium" | "large";
  fullWidth?: boolean;
  variant?: "rounded" | "rectangle";
  className?: string;
  colorScheme?: ThemeColors;
}

export const SelectButton = forwardRef(
  (
    {
      withArrow = true,
      isOpen = false,
      children,
      size = "regular",
      fullWidth = false,
      variant = "rectangle",
      className,
      colorScheme = ThemeColors.GREEN,
      ...props
    }: PropsWithChildren<Props>,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <button
        ref={ref}
        {...props}
        className={clsxMerge(
          "group flex items-center gap-2 duration-200 text-base text-primary-text bg-primary-bg",
          props.disabled
            ? "opacity-20 pointer-events-none"
            : colorScheme === ThemeColors.GREEN
              ? " hover:bg-green-bg hover:text-primary-text"
              : " hover:bg-purple-bg hover:text-primary-text",
          variant === "rectangle" && "rounded-2",
          variant === "rounded" &&
            !props.disabled &&
            (colorScheme === ThemeColors.GREEN
              ? "rounded-[80px] border border-transparent hover:bg-green-bg hover:shadow shadow-green/60 hover:border-green"
              : " rounded-[80px] border border-transparent hover:bg-purple-bg hover:shadow shadow-purple/60 hover:border-purple"),
          variant === "rounded" &&
            props.disabled &&
            "rounded-[80px] border border-transparent opacity-20 pointer-events-none",
          isOpen &&
            (colorScheme === ThemeColors.GREEN
              ? "bg-green-bg border-green"
              : " bg-purple-bg border-purple"),
          size === "large" && "p-2 lg:px-5 lg:py-2.5 lg:text-24 min-h-12",
          size === "regular" && "py-2 px-3",
          size === "medium" && "py-2 lg:py-3 px-3",
          fullWidth && withArrow && "w-full justify-between",
          fullWidth && !withArrow && "w-full justify-center",
          className,
        )}
      >
        {children}
        {withArrow && (
          <Svg
            className={clsx(
              "text-secondary-text group-hover:text-primary-text",
              isOpen ? "-rotate-180" : "",
              "duration-200",
              "flex-shrink-0",
            )}
            iconName="small-expand-arrow"
          />
        )}
      </button>
    );
  },
);

SelectButton.displayName = "SelectButton";

export default SelectButton;
