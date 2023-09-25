import React from "react";
import styles from "./Snackbar.module.scss";
import clsx from "clsx";
import { snackbarIcons } from "./snackbarIcons";

type SnackbarSeverity = "error" | "success" | "info" | "warning";

interface Props {
  severity: SnackbarSeverity;
  message: string;
  handleClose: any;
}

export default function Snackbar({ severity, message, handleClose }: Props) {
  return (
    <div className={clsx(styles.customSnackbar, styles[severity])}>
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
