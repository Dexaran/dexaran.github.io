import clsx from "clsx";
import { PropsWithChildren } from "react";

import Svg from "./Svg";

export default function SelectOption({
  onClick,
  isActive,
  disabled = false,
  children,
}: PropsWithChildren<{ onClick: any; isActive: boolean; disabled?: boolean }>) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex gap-2 items-center py-3 px-5 bg-primary-bg hover:bg-quaternary-bg duration-200 w-full",
        isActive && "text-green pointer-events-none",
        disabled && "opacity-50 pointer-events-none",
      )}
    >
      {children}

      {isActive && <Svg className="ml-auto" iconName="check" />}
    </button>
  );
}
