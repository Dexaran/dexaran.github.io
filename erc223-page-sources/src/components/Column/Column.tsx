import React, { PropsWithChildren } from "react";
import styles from "./Column.module.scss";
import clsx from "clsx";
import { ToolTip } from "../Tooltip/Tooltip";

interface Props {
  title: string;
  description?: string;
  tooltipText?: string;
}

export default function Column({
  title,
  description,
  tooltipText,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <div className={styles.columnTitleWrapper}>
          <div className={styles.title}>{title}</div>
          {tooltipText ? <ToolTip text={tooltipText} /> : null}
        </div>
        <div className={styles.description}>{description}</div>
      </div>

      <div className={clsx(styles.columnContent, "scrollbar")}>{children}</div>
    </div>
  );
}
