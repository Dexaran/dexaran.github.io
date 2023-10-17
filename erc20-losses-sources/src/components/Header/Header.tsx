/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "./Header.module.scss";
import clsx from "clsx";
import { basePath } from "@/constants/build-config/isProd";


export const Header = () => {
  return (
    <header className={styles.header}>
      <img
        className={clsx(styles.bgImage, styles.leftImage)}
        src={`${basePath}/left-header-bg.png`}
        alt=""
      />
      <img
        className={clsx(styles.bgImage, styles.rightImage)}
        src={`${basePath}/right-header-bg.png`}
        alt=""
      />
      <h1>Losses calculator</h1>
      <h2>Lorem ipsum dolor sit amet consectetur. Et vel blandit enim sed porta.</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur. Ut suspendisse morbi tellus nulla sodales volutpat
        lorem malesuada placerat. Varius enim in massa commodo. Amet vivamus nulla augue viverra
        diam duis maecenas morbi vivamus. Aliquet et gravida nulla nulla nunc. Convallis vestibulum
        phasellus eu ipsum.
      </p>
    </header>
  );
};
