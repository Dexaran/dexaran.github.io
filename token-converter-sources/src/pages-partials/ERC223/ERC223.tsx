import React from "react";
import homeStyles from "../../styles/Home.module.scss";
import styles from "./ERC223.module.scss";
import clsx from "clsx";
import { Content } from "@/constants/content";

export const ERC223 = () => {
  return (
    <>
      <div className={styles.contentBlockHeader}>
        <h1 className={clsx(homeStyles.h1, styles.h1)}>{Content.erc223.title}</h1>
        <p className={clsx(homeStyles.description, styles.description)}>
          {Content.erc223.description}
        </p>
      </div>
    </>
  );
};
