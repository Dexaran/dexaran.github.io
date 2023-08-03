import React, { useState } from "react";
import styles from "./RecentEvent.module.scss";
import Collapse from "../Collapse/Collapse";

interface Props {
  title: string,
  url?: string,
  urls?: {
    url: string,
    title: string,  
  }[],
  date: string
}

export default function RecentEvent({ url, urls, title, date }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  if (urls?.length) {
    return (
      <>
        <div className={styles.recentEventMultipleLinks} onClick={ ()=>setIsOpen(!isOpen)}>
          <div className={styles.titleConrainer}>
            <span className={styles.text}>
              <span className={styles.title}>{title}</span>
              <span className={styles.date}>{date}</span>
            </span>
            <span className={`${styles.chevron} ${isOpen ? styles.open : ""}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6641 15.9521C11.8838 15.9521 12.0771 15.8643 12.2441 15.6973L19.0557 8.73633C19.2139 8.57812 19.293 8.38477 19.293 8.15625C19.293 7.70801 18.9502 7.35645 18.4932 7.35645C18.2646 7.35645 18.0713 7.44434 17.9219 7.58496L11.6641 13.9834L5.40625 7.58496C5.25684 7.44434 5.05469 7.35645 4.83496 7.35645C4.37793 7.35645 4.03516 7.70801 4.03516 8.15625C4.03516 8.38477 4.11426 8.57812 4.26367 8.73633L11.084 15.6973C11.2422 15.8643 11.4443 15.9521 11.6641 15.9521Z" fill="currentColor"/>
              </svg>
            </span>
          </div>
          <Collapse open={isOpen} style={{width:"100%"}}>
            <div className={styles.urlsContainer}>
              {urls.map(({ title, url }) => (
                <a target="_blank"  key={url} className={styles.urlContainer} href={url} onClick={(event) => event.stopPropagation()}>
                  <span className={styles.urlTitle}>{title}</span>
                  <span className={styles.urlArrow}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.3213 11.6621C20.3213 11.8818 20.2334 12.084 20.0576 12.251L14.2129 18.0781C14.0371 18.2451 13.8525 18.3242 13.6416 18.3242C13.2109 18.3242 12.877 18.0078 12.877 17.5684C12.877 17.3574 12.9473 17.1465 13.0879 17.0146L15.0566 15.0107L18.0186 12.3125L15.8916 12.4443H4.77344C4.31641 12.4443 4 12.1191 4 11.6621C4 11.2051 4.31641 10.8799 4.77344 10.8799H15.8916L18.0098 11.0117L15.0566 8.31348L13.0879 6.30957C12.9473 6.16895 12.877 5.9668 12.877 5.75586C12.877 5.31641 13.2109 5 13.6416 5C13.8525 5 14.0371 5.07031 14.2305 5.26367L20.0576 11.0732C20.2334 11.2402 20.3213 11.4424 20.3213 11.6621Z" fill="currentColor"/>
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </Collapse>
        </div>
      </>
    )
  }
  return (
    <a target="_blank" className={styles.recentEvent} href={url}>
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
  )
}
