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
import { Delete } from "./Delete";
import { Menu } from "./Menu";
import { FAQ } from "./FAQ";
import { ERC223 } from "./ERC223";
import { ViewAddress } from "./ViewAddress";
import { Swap2 } from "./Swap2";
import { Warning } from "./Warning";
import { Calendar } from "./Calendar";
import { Calculate } from "./Calculate";
import { Download } from "./Download";
import { OpenLink } from "./OpenLink";

enum IconName {
  "add" = "add",
  "info" = "info",
  "swap" = "swap",
  "swap2" = "swap2",
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
  "delete" = "delete",
  "menu" = "menu",
  "faq" = "faq",
  "erc223" = "erc223",
  "viewAddress" = "viewAddress",
  "warning" = "warning",
  "calendar" = "calendar",
  "calculate" = "calculate",
  "download" = "download",
  "openLink" = "openLink",
}

type IconNameType = keyof typeof IconName;

const icons: {
  [iconName: string]: any;
} = {
  [IconName.add]: Add,
  [IconName.info]: Info,
  [IconName.swap]: Swap,
  [IconName.swap2]: Swap2,
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
  [IconName.delete]: Delete,
  [IconName.menu]: Menu,
  [IconName.faq]: FAQ,
  [IconName.erc223]: ERC223,
  [IconName.viewAddress]: ViewAddress,
  [IconName.warning]: Warning,
  [IconName.calendar]: Calendar,
  [IconName.calculate]: Calculate,
  [IconName.download]: Download,
  [IconName.openLink]: OpenLink,
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
