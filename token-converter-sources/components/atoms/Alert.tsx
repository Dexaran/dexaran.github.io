import clsx from "clsx";
import { ReactNode } from "react";

import { clsxMerge } from "@/utils/clsxMerge";

import Svg from "./Svg";

export type AlertType = "success" | "info" | "error" | "warning" | "info-border";

interface Props {
  text: string | ReactNode;
  withIcon?: boolean;
  type?: AlertType;
  className?: string;
}

const iconsMap: Record<AlertType, ReactNode> = {
  success: <Svg iconName="success" className="flex-shrink-0" />,
  info: <Svg iconName="info" className="flex-shrink-0" />,
  error: <Svg iconName="warning" className="flex-shrink-0" />,
  warning: <Svg iconName="warning" className="flex-shrink-0" />,
  "info-border": <Svg iconName="info" className="flex-shrink-0" />,
};

export default function Alert({ text, type = "success", withIcon = true, className = "" }: Props) {
  return (
    <div
      className={clsxMerge(
        `
        relative
        flex
        outline
        rounded-2
        gap-2
        px-4
        md:px-5
        py-2
        overflow-hidden
        group
        text-14
        text-secondary-text
        `,
        type === "success" && "outline-green bg-green-bg outline-1",
        type === "error" && "outline-red-light bg-red-bg outline-1",
        type === "warning" && "outline-orange bg-orange-bg outline-1",
        type === "info" && "outline-blue bg-blue-bg outline-1",
        type === "info-border" && "border-l-4 border-l-blue outline-0 bg-primary-bg pl-4",
        className,
      )}
    >
      {withIcon && (
        <div
          className={clsx(
            "flex justify-center flex-shrink-0 items-stretch",
            type === "success" && "text-green",
            type === "error" && "text-red-light",
            type === "warning" && "text-orange",
            type === "info" && "text-blue",
            type === "info-border" && "text-blue",
          )}
        >
          {iconsMap[type]}
        </div>
      )}
      <div className="flex items-center">{text}</div>
    </div>
  );
}
