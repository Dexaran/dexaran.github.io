import { AnchorHTMLAttributes } from "react";

import { clsxMerge } from "@/utils/clsxMerge";

import Svg from "./Svg";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
  href: string;
  arrowSize?: number;
  color?: "green" | "white";
  textClassname?: string;
}

export default function ExternalTextLink({
  text,
  href,
  color = "green",
  className,
  arrowSize = 24,
  textClassname,
  ...props
}: Props) {
  return (
    <a
      {...props}
      target="_blank"
      href={href}
      className={clsxMerge(
        "flex items-center duration-200",
        color === "green" ? "text-green hover:text-green-hover" : "text-white hover:text-green",
        className,
      )}
    >
      <span className={textClassname}>{text}</span>
      <Svg iconName="forward" className="flex-shrink-0" size={arrowSize} />
    </a>
  );
}
