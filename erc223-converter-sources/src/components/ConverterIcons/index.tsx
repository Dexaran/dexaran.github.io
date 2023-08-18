import React, { ComponentProps } from "react";
import { Info } from "./Info";
import { Swap } from "./Swap";
import { ChevronDown } from "./ChevronDown";
import { TestToken } from "./TestToken";
import { Close } from "./Close";
import { Success } from "./Success";

enum IconName {
  "info" = "info",
  "swap" = "swap",
  "chevronDown" = "chevronDown",
  "testToken" = "testToken",
  "close" = "close",
  "success" = "success",
}

type IconNameType = keyof typeof IconName;

const icons: {
  [iconName: string]: any;
} = {
  [IconName.info]: Info,
  [IconName.swap]: Swap,
  [IconName.chevronDown]: ChevronDown,
  [IconName.testToken]: TestToken,
  [IconName.close]: Close,
  [IconName.success]: Success,
};

export const ConverterIcons = ({ name, size = "24px", ...rest }: ComponentProps<"svg"> & { name: IconNameType, size?: string | number }) => {
  const Icon = icons[name];
  if (!Icon) return <span>?</span>;
  return <Icon size={size} {...rest} />;
};
