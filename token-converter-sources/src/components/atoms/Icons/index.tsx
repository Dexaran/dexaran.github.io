import React, { ComponentProps } from "react";
import { Info } from "./Info";
import { Swap } from "./Swap";
import { ChevronDown } from "./ChevronDown";
import { Close } from "./Close";
import { Success } from "./Success";
import { Search } from "./Search";
import { Copy } from "./Copy";
import { Github } from "./Github";
import { Report } from "./Report";
import { Wallet } from "./Wallet";
import { Logout } from "./Logout";
import { Drag } from "./Drag";
import { Add } from "./Add";
import { Update } from "./Update";

enum IconName {
  "add" = "add",
  "info" = "info",
  "swap" = "swap",
  "chevronDown" = "chevronDown",
  "close" = "close",
  "success" = "success",
  "search" = "search",
  "copy" = "copy",
  "github" = "github",
  "report" = "report",
  "wallet" = "wallet",
  "logout" = "logout",
  "drag" = "drag",
  "update" = "update",
}

type IconNameType = keyof typeof IconName;

const icons: {
  [iconName: string]: any;
} = {
  [IconName.add]: Add,
  [IconName.info]: Info,
  [IconName.swap]: Swap,
  [IconName.chevronDown]: ChevronDown,
  [IconName.close]: Close,
  [IconName.success]: Success,
  [IconName.search]: Search,
  [IconName.copy]: Copy,
  [IconName.github]: Github,
  [IconName.report]: Report,
  [IconName.wallet]: Wallet,
  [IconName.logout]: Logout,
  [IconName.drag]: Drag,
  [IconName.update]: Update,
};

export const Icons = ({
  name,
  size = "24px",
  ...rest
}: ComponentProps<"svg"> & { name: IconNameType; size?: string | number }) => {
  const Icon = icons[name];
  if (!Icon) return <span>?</span>;
  return <Icon size={size} {...rest} />;
};
