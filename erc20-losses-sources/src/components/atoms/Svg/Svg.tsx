import React, { SVGProps } from "react";

import { IconName } from "./svgIconsMap";

interface Props extends SVGProps<SVGSVGElement> {
  iconName: IconName;
  sprite?: "sprite" | "social";
  size?: number;
  style?: React.CSSProperties;
  layout?: "cover" | undefined;
}

export default function Svg({
  iconName,
  size = 24,
  style,
  sprite = "sprite",
  layout = undefined,
  ...rest
}: Props) {
  return (
    <svg
      style={{
        width: layout === "cover" ? "100%" : size,
        height: layout === "cover" ? "100%" : size,
        ...style,
      }}
      {...rest}
    >
      <use xlinkHref={`/${sprite}.svg#${iconName}`} />
    </svg>
  );
}
