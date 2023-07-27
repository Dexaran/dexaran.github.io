import React from "react";
import styles from "./RecentEvent.module.scss";

interface Props {
  url: string,
  title: string,
  date: string
}

export default function RecentEvent({url, title, date}: Props) {
  return <a target="_blank" className={styles.recentEvent} href={url}>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.date}>{date}</span>
      </span>

      <span className={styles.arrow}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.3213 11.6621C20.3213 11.8818 20.2334 12.084 20.0576 12.251L14.2129 18.0781C14.0371 18.2451 13.8525 18.3242 13.6416 18.3242C13.2109 18.3242 12.877 18.0078 12.877 17.5684C12.877 17.3574 12.9473 17.1465 13.0879 17.0146L15.0566 15.0107L18.0186 12.3125L15.8916 12.4443H4.77344C4.31641 12.4443 4 12.1191 4 11.6621C4 11.2051 4.31641 10.8799 4.77344 10.8799H15.8916L18.0098 11.0117L15.0566 8.31348L13.0879 6.30957C12.9473 6.16895 12.877 5.9668 12.877 5.75586C12.877 5.31641 13.2109 5 13.6416 5C13.8525 5 14.0371 5.07031 14.2305 5.26367L20.0576 11.0732C20.2334 11.2402 20.3213 11.4424 20.3213 11.6621Z" fill="currentColor"/>
        </svg>
      </span>
  </a>
}
