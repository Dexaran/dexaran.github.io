import clsx from "clsx";
import Image from "next/image";

import { basePath } from "@/config/build/paths";
import { Standard } from "@/config/standard.config";
import { clsxMerge } from "@/utils/clsxMerge";

export enum BadgeVariant {
  COLORED,
  DEFAULT,
  PERCENTAGE,
  STANDARD,
}

type StandardBadgeColor = "green" | "purple";
type StandardBadgeSize = "small" | "default";

const badgeImagesMap: Record<
  Standard,
  Record<StandardBadgeColor, Record<StandardBadgeSize, string>>
> = {
  [Standard.ERC20]: {
    green: {
      small: "erc-20-green-small.svg",
      default: "erc-20-green.svg",
    },
    purple: {
      small: "erc-20-purple-small.svg",
      default: "erc-20-purple.svg",
    },
  },
  [Standard.ERC223]: {
    green: {
      small: "erc-223-green-small.svg",
      default: "erc-223-green.svg",
    },
    purple: {
      small: "erc-223-purple-small.svg",
      default: "erc-223-purple.svg",
    },
  },
};

const standardBadgeSizes: Record<
  StandardBadgeSize,
  { width: Record<Standard, number>; height: number }
> = {
  small: {
    height: 16,
    width: {
      [Standard.ERC20]: 56,
      [Standard.ERC223]: 62,
    },
  },
  default: {
    height: 20,
    width: {
      [Standard.ERC20]: 60,
      [Standard.ERC223]: 66,
    },
  },
};

type Props =
  | {
      variant?: BadgeVariant.COLORED;
      color?: "blue" | "red" | "green" | "purple" | "grey" | "green_outline" | "grey_outline";
      size?: "default" | "small";
      text: string;
      className?: string;
    }
  | {
      variant: BadgeVariant.PERCENTAGE;
      percentage: number | string;
      className?: string;
    }
  | {
      variant: BadgeVariant.DEFAULT;
      size?: "default" | "small";
      text: string;
      className?: string;
    }
  | {
      variant: BadgeVariant.STANDARD;
      standard: Standard;
      color?: StandardBadgeColor;
      size?: StandardBadgeSize;
      className?: string;
    };
export default function Badge(props: Props) {
  switch (props.variant) {
    case BadgeVariant.COLORED:
    case undefined: {
      const { text, color = "green", size = "default", className } = props;
      return (
        <div
          className={clsxMerge(
            "rounded-5 px-2 font-medium box-border text-nowrap",
            color === "blue" && "bg-blue-bg shadow-[0_0_0_1px_theme(colors.blue)_inset] text-blue",
            color === "green" &&
              "bg-erc-20-bg shadow-[0_0_0_1px_theme(colors.erc-20-border)_inset] text-erc-20-text",
            color === "green_outline" &&
              "text-green shadow-[0_0_0_1px_theme(colors.green-bg)_inset]",
            color === "grey_outline" &&
              "text-tertiary-text shadow-[0_0_0_1px_theme(colors.secondary-border)_inset]",
            color === "purple" &&
              "bg-erc-223-bg shadow-[0_0_0_1px_theme(colors.erc-223-border)_inset] text-erc-223-text",
            color === "red" && "bg-red-bg shadow-[0_0_0_1px_theme(colors.red)_inset] text-red",
            color === "grey" &&
              "bg-quaternary-bg text-secondary-text shadow-[0_0_0_1px_theme(colors.quaternary-bg)_inset]",

            size === "default" ? "text-12 py-0.5" : "text-10",
            className,
          )}
        >
          {text}
        </div>
      );
    }
    case BadgeVariant.DEFAULT: {
      const { text: defaultText, size = "default", className } = props;
      return (
        <div
          className={clsx(
            "bg-tertiary-bg text-secondary-text px-2 rounded-20 font-medium inline-block",
            size === "small" && "text-14",
            className,
          )}
        >
          {defaultText}
        </div>
      );
    }
    case BadgeVariant.PERCENTAGE: {
      const { percentage, className } = props;
      return (
        <div
          className={clsx(
            "border border-secondary-border text-tertiary-text px-2 lg:px-3 rounded-5 h-5 lg:h-6 flex items-center justify-center text-12 lg:text-16",
            className,
          )}
        >
          {typeof percentage === "number" ? `${percentage}% select` : percentage}
        </div>
      );
    }

    case BadgeVariant.STANDARD:
      const { standard, color = "green", size = "default", className } = props;

      return (
        <Image
          className={className}
          src={`${basePath}/images/badges/${badgeImagesMap[standard][color][size]}`}
          alt={""}
          width={standardBadgeSizes[size].width[standard]}
          height={standardBadgeSizes[size].height}
        />
      );
  }
}
