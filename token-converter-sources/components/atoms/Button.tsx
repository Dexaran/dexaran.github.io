import { ButtonHTMLAttributes } from "react";

import { IconName } from "@/types/IconName";
import { clsxMerge } from "@/utils/clsxMerge";

import Svg from "./Svg";

export const enum ButtonVariant {
  CONTAINED = "contained",
  OUTLINED = "outlined",
}

export const enum ButtonSize {
  EXTRA_SMALL = 20,
  SMALL = 32,
  MEDIUM = 40,
  LARGE = 48,
  EXTRA_LARGE = 60,
}

export const enum ButtonColor {
  GREEN,
  RED,
  LIGHT_GREEN,
  LIGHT_RED,
  LIGHT_YELLOW,
  PURPLE,
  LIGHT_PURPLE,
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  colorScheme?: ButtonColor;
  mobileSize?: ButtonSize;
  tabletSize?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  CommonProps &
  (
    | {
        endIcon?: IconName;
        startIcon?: never;
      }
    | { startIcon?: IconName; endIcon?: never }
  );

const buttonVariantClassnameMap: Record<ButtonVariant, Record<ButtonColor, string>> = {
  [ButtonVariant.CONTAINED]: {
    [ButtonColor.RED]: "bg-red text-primary-text hover:bg-red-hover",
    [ButtonColor.GREEN]: "bg-green text-black hover:bg-green-hover",
    [ButtonColor.LIGHT_RED]:
      "bg-red-bg text-secondary-text border-transparent border hover:border-red-light hover:bg-red-bg-hover hover:text-primary-text",
    [ButtonColor.LIGHT_YELLOW]:
      "bg-yellow-bg text-secondary-text border-transparent border hover:border-yellow-light hover:bg-yellow-bg-hover hover:text-primary-text",
    [ButtonColor.LIGHT_GREEN]:
      "bg-green-bg text-secondary-text border-transparent border hover:border-green hover:bg-green-bg-hover hover:text-primary-text",
    [ButtonColor.LIGHT_PURPLE]:
      "bg-purple-bg text-secondary-text border-transparent border hover:border-purple-hover hover:bg-purple-bg-hover hover:text-primary-text",
    [ButtonColor.PURPLE]: "bg-purple text-secondary-bg hover:bg-purple-hover",
  },
  [ButtonVariant.OUTLINED]: {
    [ButtonColor.RED]:
      "border border-primary text-secondary-text hover:bg-red-bg hover:border-primary-text hover:text-primary-text",
    [ButtonColor.GREEN]: "border border-green text-primary-text hover:bg-green-bg",
    [ButtonColor.LIGHT_RED]: "bg-red-light text-black hover:bg-red-hover",
    [ButtonColor.LIGHT_YELLOW]: "bg-yellow-light text-black hover:bg-red-hover",
    [ButtonColor.LIGHT_GREEN]:
      "bg-green-bg text-primary-text border-transparent border hover:border-green",
    [ButtonColor.PURPLE]:
      "bg-red-bg text-secondary-text border-transparent border hover:border-red-light hover:bg-red-bg-hover hover:text-primary-text",
    [ButtonColor.LIGHT_PURPLE]:
      "bg-red-bg text-secondary-text border-transparent border hover:border-red-light hover:bg-red-bg-hover hover:text-primary-text",
  },
};

const buttonSizeClassnameMap: Record<ButtonSize, string> = {
  [ButtonSize.EXTRA_SMALL]: "lg:text-12 lg:min-h-5 lg:rounded-20 lg:px-4",
  [ButtonSize.SMALL]: "lg:text-14 lg:font-medium lg:min-h-8 lg:rounded-20 lg:px-6",
  [ButtonSize.MEDIUM]: "lg:text-16 lg:font-medium lg:min-h-10 lg:rounded-2 lg:px-6",
  [ButtonSize.LARGE]: "lg:text-16 lg:font-medium lg:min-h-12 lg:rounded-3 lg:px-6",
  [ButtonSize.EXTRA_LARGE]: "lg:text-18 lg:font-medium lg:min-h-[60px] lg:rounded-3 lg:px-6",
};

const tabletButtonSizeClassnameMap: Record<ButtonSize, string> = {
  [ButtonSize.EXTRA_SMALL]: "sm:text-12 sm:min-h-5 sm:rounded-20 sm:px-4",
  [ButtonSize.SMALL]: "sm:text-14 sm:font-medium sm:min-h-8 sm:rounded-20 sm:px-6",
  [ButtonSize.MEDIUM]: "sm:text-16 sm:font-medium sm:rounded-2 sm:min-h-10 sm:px-6",
  [ButtonSize.LARGE]: "sm:text-16 sm:font-medium sm:rounded-3 sm:min-h-12 sm:px-6",
  [ButtonSize.EXTRA_LARGE]: "sm:text-18 sm:font-medium sm:rounded-3 sm:min-h-[60px] sm:px-6",
};

const mobileButtonSizeClassnameMap: Record<ButtonSize, string> = {
  [ButtonSize.EXTRA_SMALL]: "text-12 min-h-5 rounded-20 px-4",
  [ButtonSize.SMALL]: "text-14 font-medium rounded-2 min-h-8 px-6",
  [ButtonSize.MEDIUM]: "text-16 font-medium rounded-2 min-h-10 px-6",
  [ButtonSize.LARGE]: "text-16 font-medium rounded-3 min-h-12 px-6",
  [ButtonSize.EXTRA_LARGE]: "text-18 font-medium rounded-3 min-h-[60px] px-6",
};

const disabledClassnameMap: Record<ButtonVariant, string> = {
  [ButtonVariant.CONTAINED]: "disabled:bg-tertiary-bg disabled:text-secondary-text",
  [ButtonVariant.OUTLINED]: "disabled:text-secondary-text disabled:border-secondary-border",
};

export default function Button({
  variant = ButtonVariant.CONTAINED,
  size = ButtonSize.LARGE,
  mobileSize,
  tabletSize,
  startIcon,
  endIcon,
  fullWidth,
  colorScheme = ButtonColor.GREEN,
  children,
  className,
  isLoading,
  ...props
}: Props) {
  const _mobileSize = mobileSize || size;
  const _tabletSize = tabletSize || size;

  return (
    <button
      className={clsxMerge(
        "flex items-center justify-center gap-2 duration-200 cursor-pointer disabled:pointer-events-none",
        buttonVariantClassnameMap[variant][colorScheme],
        buttonSizeClassnameMap[size],
        tabletButtonSizeClassnameMap[_tabletSize],
        mobileButtonSizeClassnameMap[_mobileSize],
        fullWidth && "w-full",
        disabledClassnameMap[variant],
        isLoading && "opacity-50 pointer-events-none",
        className,
      )}
      {...props}
    >
      {startIcon && <Svg iconName={startIcon} />}
      {children}
      {endIcon && <Svg iconName={endIcon} />}
    </button>
  );
}
