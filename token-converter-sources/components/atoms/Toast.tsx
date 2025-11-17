import clsx from "clsx";
import { ReactNode } from "react";

import IconButton, { IconButtonSize, IconButtonVariant } from "./IconButton";
import Svg from "./Svg";

export type ToastType = "success" | "info" | "error" | "warning";

interface Props {
  text: string;
  onDismiss: any;
  type?: ToastType;
}

const iconsMap: Record<ToastType, ReactNode> = {
  success: <Svg iconName="done" />,
  info: <Svg iconName="info" />,
  error: <Svg iconName="warning" />,
  warning: <Svg iconName="warning" />,
};

export default function Toast({ text, type = "success", onDismiss }: Props) {
  return (
    <div
      className={clsx(
        `
        relative
        flex
        justify-between
        items-center
        outline-1
        outline
        rounded-2
        gap-3
        md:gap-5
        pl-4
        lg:pl-5
        overflow-hidden
        box-border
        py-2
        lg:py-3
        pr-2
        lg:pr-3
        max-md:text-14
        `,
        type === "success" && "outline-green bg-green-bg",
        type === "error" && "outline-red-light bg-red-bg",
        type === "warning" && "outline-orange bg-orange-bg",
        type === "info" && "outline-blue bg-blue-bg",
      )}
    >
      <div className="flex gap-1 md:gap-2 items-center">
        <div
          className={clsx(
            "flex items-center justify-center flex-shrink-0",
            type === "success" && "text-green",
            type === "error" && "text-red-light",
            type === "warning" && "text-orange",
            type === "info" && "text-blue",
          )}
        >
          {iconsMap[type]}
        </div>
        {text}
      </div>

      <IconButton
        buttonSize={IconButtonSize.EXTRA_SMALL}
        variant={IconButtonVariant.CLOSE}
        handleClose={onDismiss}
      />
    </div>
  );
}
