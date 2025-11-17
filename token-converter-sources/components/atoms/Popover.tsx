import { flip, shift } from "@floating-ui/core";
import {
  autoUpdate,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  Placement,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import React, { CSSProperties, PropsWithChildren, ReactElement } from "react";

interface Props {
  placement: Placement;
  isOpened?: boolean;
  setIsOpened?: (isOpened: boolean) => void;
  trigger: ReactElement;
  customOffset?: number;
  customStyles?: CSSProperties;
}

export default function Popover({
  placement,
  isOpened,
  setIsOpened,
  children,
  trigger,
  customOffset,
  customStyles = {},
}: PropsWithChildren<Props>) {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpened,
    onOpenChange: setIsOpened,
    middleware: [
      offset(customOffset || 24),
      flip({ fallbackAxisSideDirection: "end", mainAxis: false }),
      shift(),
    ],
    placement,
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: {
      open: 200,
      close: 200,
    },
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </div>
      {isMounted && (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={-1}
            returnFocus={false}
          >
            <div
              // eslint-disable-next-line react-hooks/refs
              ref={refs.setFloating}
              style={{
                ...floatingStyles,
                ...transitionStyles,
                ...customStyles,
                zIndex: 99,
                // top: y ?? 0,
                // left: x ?? 0,
                // position: strategy,
              }}
              {...getFloatingProps()}
            >
              {children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
