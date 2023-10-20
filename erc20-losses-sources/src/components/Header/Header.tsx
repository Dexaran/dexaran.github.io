/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "./Header.module.scss";
import clsx from "clsx";
import { basePath } from "@/constants/build-config/isProd";


export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* <div className={styles.leftHeader}>
          <img className={clsx(styles.headerImage)} src={`${basePath}/left-header-1.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/left-header-2.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/left-header-3.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/left-header-4.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/left-header-5.png`} alt="" />
        </div> */}

        <h1>Losses calculator</h1>
        <h2>Lorem ipsum dolor sit amet consectetur. Et vel blandit enim sed porta.</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur. Ut suspendisse morbi tellus nulla sodales volutpat
          lorem malesuada placerat. Varius enim in massa commodo. Amet vivamus nulla augue viverra
          diam duis maecenas morbi vivamus. Aliquet et gravida nulla nulla nunc. Convallis
          vestibulum phasellus eu ipsum.
        </p>
        {/* <div className={styles.rightHeader}>
          <img className={clsx(styles.headerImage)} src={`${basePath}/right-header-1.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/right-header-2.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/right-header-3.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/right-header-4.png`} alt="" />
        </div> */}
      </div>
    </header>
  );
};
