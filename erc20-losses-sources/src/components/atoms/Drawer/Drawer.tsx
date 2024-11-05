import clsx from "clsx";
import React from "react";
import { useSwipeable } from "react-swipeable";

import Portal from "../Portal";
import styles from "./Drawer.module.scss";

interface Props {
  isOpen: boolean;
  children: any;
  className?: string;
  onClose: () => void;
  position: "left" | "right" | "top" | "bottom";
  width?: number;
}

export default function Drawer({
  isOpen,
  children,
  onClose,
  position = "left",
  width = 280,
}: Props) {
  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => onClose(),
    onTap: () => onClose(),
    trackMouse: true,
  });

  return (
    <Portal
      className={clsx(styles.drawerContainer, isOpen && styles.open)}
      root="drawer-root"
      onClose={onClose}
      isOpen={isOpen}
      isTransitioningClassName={styles.in}
    >
      <div
        className={clsx(styles.drawer, styles[position])}
        style={{ width: position === "left" || position === "right" ? width : "100%" }}
        role="dialog"
      >
        {children}
      </div>
      <div {...handlers} className={styles.backdrop} />
    </Portal>
  );
}
