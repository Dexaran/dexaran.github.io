import clsx from "clsx";
import { Goldman } from "next/font/google";
import React from "react";

import styles from "./Snackbar.module.scss";
import { snackbarIcons } from "./snackbarIcons";
const goldman = Goldman({ subsets: ["latin"], weight: ["400", "700"] });

type SnackbarSeverity = "error" | "success" | "info" | "warning";

interface Props {
  severity: SnackbarSeverity;
  message: string;
  handleClose: any;
}

export default function Snackbar({ severity, message, handleClose }: Props) {
  return (
    <div className={clsx(styles.customSnackbar, styles[severity], goldman.className)}>
      <div className={styles.snackbarContainer}>
        <div className={styles.snackbarBlock}>
          <div className={styles.iconWrapper}>{snackbarIcons[severity]}</div>
          <p>
            <span className={styles.text}>{message}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
