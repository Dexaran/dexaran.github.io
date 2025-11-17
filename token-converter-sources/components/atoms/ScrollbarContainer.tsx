import "simplebar-react/dist/simplebar.min.css";

import { HTMLAttributes, PropsWithChildren } from "react";
import SimpleBar from "simplebar-react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  height: number | "full";
  scrollableNodeProps?: { [p: string]: any; ref?: any; className?: string | undefined } | undefined;
}
export default function ScrollbarContainer({
  children,
  height,
  scrollableNodeProps,
  style = {},
  ...props
}: PropsWithChildren<Props>) {
  return (
    <SimpleBar
      scrollableNodeProps={scrollableNodeProps}
      className={props.className}
      autoHide={false}
      style={
        height === "full"
          ? {
              flex: 1,
              display: "flex",
              flexDirection: "column",
              ...style,
            }
          : { height: `${height}px`, ...style }
      }
      {...props}
    >
      {children}
    </SimpleBar>
  );
}
