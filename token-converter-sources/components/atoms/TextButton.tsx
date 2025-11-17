import { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { ThemeColors } from "@/config/theme-colors.config";
import { IconName } from "@/types/IconName";
import { clsxMerge } from "@/utils/clsxMerge";

import Svg from "./Svg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  colorScheme?: ThemeColors;
  endIcon?: IconName;
}

export default function TextButton({
  colorScheme = ThemeColors.GREEN,
  endIcon,
  children,
  className,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <button
      className={clsxMerge(
        "disabled:opacity-50 disabled:pointer-events-none disabled:text-tertiary-text rounded-2 flex items-center justify-center gap-2 px-6 duration-200",
        "text-secondary-text ",
        {
          [ThemeColors.GREEN]: "hover:text-green-hover",
          [ThemeColors.PURPLE]: "hover:text-purple-hover",
        }[colorScheme],
        className,
      )}
      {...props}
    >
      {children}
      {endIcon && <Svg iconName={endIcon} />}
    </button>
  );
}
