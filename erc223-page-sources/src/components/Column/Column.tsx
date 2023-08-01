import React, {PropsWithChildren} from "react";
import styles from "./Column.module.scss";
import clsx from "clsx";

interface Props {
  title: string,
  description?: string
}

export default function Column({title, description, children}: PropsWithChildren<Props>) {
  return <div className={styles.column}>
    <div className={styles.columnHeader}>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>

    <div className={clsx(styles.columnContent, "scrollbar")}>
      {children}
    </div>
  </div>
}
