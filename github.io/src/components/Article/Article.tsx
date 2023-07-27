import React from "react";
import styles from "./Article.module.scss";

interface Props {
  url: string,
  title: string,
  description: string
}

export default function Article({url, title, description}: Props) {
  return <a target="_blank" className={styles.link} href={url}>
      <span className={styles.articleTitle}>{title}</span>
      <span className={styles.description}>{description}</span>
    </a>
}
