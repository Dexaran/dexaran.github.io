import React, { ComponentProps } from "react";
import { Github } from "./Github";

enum IconName {
  "github" = "github",
}

type IconNameType = keyof typeof IconName;

const icons: {
  [iconName: string]: any;
} = {
  [IconName.github]: Github,
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
