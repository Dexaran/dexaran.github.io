import { PropsWithChildren } from "react";

import { clsxMerge } from "@/utils/clsxMerge";

export default function Container({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={clsxMerge("max-w-[1406px] my-0 mx-auto", className)}>{children}</div>;
}
