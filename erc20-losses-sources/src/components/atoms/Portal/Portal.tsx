import clsx from "clsx";
import React, { createRef } from "react";
import { createPortal } from "react-dom";

import { useCloseWithEscape } from "../../../hooks/useCloseWithEscape";
import useMountTransition from "../../../hooks/useMountTransition";
import { useScrollBlockingOnOpen } from "../../../hooks/useScrollBlockingOnOpen";

interface Props {
  root: string;
  isOpen: boolean | null;
  removeWhenClosed?: boolean;
  children: any;
  onClose: any;
  className?: string | null;
  isTransitioningClassName?: string;
}

export default function Portal({
  root,
  isOpen,
  children,
  onClose,
  removeWhenClosed = true,
  className = null,
  isTransitioningClassName,
}: Props) {
  const ref = createRef<HTMLDivElement>();
  const isTransitioning = useMountTransition(isOpen, 300);

  useScrollBlockingOnOpen(isOpen);

  useCloseWithEscape(isOpen, onClose);

  if (!isTransitioning && removeWhenClosed && !isOpen) {
    return null;
  }

  return createPortal(
    <div
      ref={ref}
      aria-hidden={isOpen ? "false" : "true"}
      className={clsx(className, isTransitioning && isTransitioningClassName)}
    >
      {children}
    </div>,
    document.getElementById(root)!,
  );
}
