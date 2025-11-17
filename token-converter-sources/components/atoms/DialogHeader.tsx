import clsx from "clsx";
import { ReactNode } from "react";
import { useSwipeable } from "react-swipeable";

import { clsxMerge } from "@/utils/clsxMerge";

import IconButton, { IconButtonSize, IconButtonVariant } from "./IconButton";

interface Props {
  onClose: () => void;
  title: ReactNode;
  paragraph?: string;
  onBack?: () => void;
  settings?: ReactNode;
  titlePosition?: "left" | "center";
  className?: string;
}
export default function DialogHeader({
  onBack,
  onClose,
  title,
  paragraph,
  settings,
  titlePosition = "left",
  className,
}: Props) {
  const handlers = useSwipeable({
    onSwipedDown: () => {
      onClose();
    },
    delta: { down: 200 },
  });

  return (
    <div
      {...handlers}
      className={clsxMerge(
        onBack || titlePosition === "center"
          ? "px-1 md:px-6"
          : "lg:pr-6 pl-4 pr-2 sm:pr-4 sm:pl-6 lg:pl-10",
        className,
      )}
    >
      <div className={clsx("h-[60px] flex items-center")}>
        <div
          className={clsx(
            "grid flex-grow",
            onBack || titlePosition === "center"
              ? "grid-cols-[1fr_3fr_1fr]"
              : "grid-cols-[1fr_auto] md:grid-cols-2",
          )}
        >
          {onBack && (
            <IconButton
              onClick={onBack}
              variant={IconButtonVariant.BACK}
              buttonSize={IconButtonSize.LARGE}
            />
          )}
          {!onBack && titlePosition === "center" && <span />}
          <h2
            className={clsx(
              "text-18 md:text-20 font-bold flex items-center text-nowrap text-primary-text",
              (onBack || titlePosition === "center") && "justify-center",
            )}
          >
            {title}
          </h2>
          <div className="flex items-center gap-2 justify-end">
            {settings && settings}
            <IconButton variant={IconButtonVariant.CLOSE} handleClose={onClose} />
          </div>
        </div>
      </div>
      {paragraph && <p className="mt-2 text-16 text-secondary-text">{paragraph}</p>}
    </div>
  );
}
