import clsx from "clsx";
import React from "react";

import Portal from "../../atoms/Portal";
import styles from "./Dialog.module.scss";

interface Props {
  isOpen: boolean | null;
  children: any;
  className?: string;
  onClose: () => void;
  closable?: boolean;
  width?: number;
}

export default function Dialog({ isOpen, children, onClose }: Props) {
  return (
    <Portal
      root="dialog-root"
      isOpen={isOpen}
      onClose={onClose}
      isTransitioningClassName={styles.in}
      className={clsx(styles.dialogContainer, isOpen && styles.open)}
    >
      <div className={clsx(styles.dialog)} role="dialog">
        {children}
      </div>
      <div
        className={styles.backdrop}
        onClick={() => {
          onClose();
        }}
      />
    </Portal>
  );
}
