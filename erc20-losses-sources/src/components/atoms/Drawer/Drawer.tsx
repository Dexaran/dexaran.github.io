import React from "react";
import clsx from "clsx";
import styles from "./Drawer.module.scss";
import Portal from "../Portal";
import { useSwipeable } from "react-swipeable";

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
