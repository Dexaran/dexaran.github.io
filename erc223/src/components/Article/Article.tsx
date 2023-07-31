import React from "react";
import styles from "./Article.module.scss";
import {basePath} from "../../constants/build-config/isProd";

interface Props {
  url: string,
  title: string,
  description: string,
  animationDelay: number,
  image?: string
}

const defaultImage = 'default.png';

export default function Article({url, title, description, animationDelay, image}: Props) {
  return <a target="_blank" className={styles.link} style={{animationDelay: `${animationDelay}s`}} href={url}>
      <img
        src={`${basePath}/images/articles/${image || defaultImage}`}
        alt=''
      />
      <div className={styles.backdrop} />
      <span className={styles.articleTitle}>{title}</span>
      <span className={styles.description}>{description}</span>
    </a>
}
