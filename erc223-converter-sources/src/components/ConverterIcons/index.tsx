import React, { ComponentProps } from "react";
import { Info } from "./Info";
import { Swap } from "./Swap";
import { ChevronDown } from "./ChevronDown";
import { Close } from "./Close";
import { Success } from "./Success";
import { Search } from "./Search";
import { Copy } from "./Copy";
import { Github } from "./Github";

enum IconName {
  "info" = "info",
  "swap" = "swap",
  "chevronDown" = "chevronDown",
  "close" = "close",
  "success" = "success",
  "search" = "search",
  "copy" = "copy",
  "github" = "github",
}

type IconNameType = keyof typeof IconName;

const icons: {
  [iconName: string]: any;
} = {
  [IconName.info]: Info,
  [IconName.swap]: Swap,
  [IconName.chevronDown]: ChevronDown,
  [IconName.close]: Close,
  [IconName.success]: Success,
  [IconName.search]: Search,
  [IconName.copy]: Copy,
  [IconName.github]: Github,
};

export const ConverterIcons = ({
  name,
  size = "24px",
  ...rest
}: ComponentProps<"svg"> & { name: IconNameType; size?: string | number }) => {
  const Icon = icons[name];
  if (!Icon) return <span>?</span>;
  return <Icon size={size} {...rest} />;
};
