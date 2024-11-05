import clsx from "clsx";
import React from "react";

import styles from "./OverlineText.module.scss";

interface Props {
  text: string;
  color: "purple" | "green" | "blue";
}

export default function OverlineText({ text, color }: Props) {
  return <h3 className={clsx(styles.overline, styles[color])}>{text}</h3>;
}
