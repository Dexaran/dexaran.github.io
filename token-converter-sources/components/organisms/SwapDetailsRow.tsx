import React, { ReactNode } from "react";

import Tooltip from "../atoms/Tooltip";

export default function SwapDetailsRow({
  title,
  value,
  tooltipText,
}: {
  title: string;
  value: string | ReactNode;
  tooltipText?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-1 items-center text-secondary-text">
        {tooltipText && <Tooltip iconSize={20} text={tooltipText} />}
        {title}
      </div>
      <span>{value}</span>
    </div>
  );
}
