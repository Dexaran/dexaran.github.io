/* eslint-disable @next/next/no-img-element */
import React from "react";
import homeStyles from "../../styles/Home.module.scss";
import styles from "./ERC223.module.scss";
import clsx from "clsx";
import { Content } from "@/constants/content";
import { basePath } from "@/constants/build-config/isProd";

export const ERC223 = () => {
  const pageContent = (Content as any).erc223;
  
  return (
    <>
      {pageContent ? (
        <div className={styles.contentBlockHeader}>
          <h1 className={clsx(homeStyles.h1, styles.h1)}>{pageContent.title}</h1>
          <p className={clsx(homeStyles.description, styles.description)}>
            {pageContent.description}
          </p>
        </div>
      ) : (
        <div className={styles.underConstructionContainer}>
          <img
            src={`${basePath}/under-construnction.svg`}
            width="324px"
            height="256px"
            alt="Under Construnction"
          />

          <h1 className={clsx(homeStyles.h1, styles.h1)}>This page is under construction</h1>
          <p className={clsx(homeStyles.description, styles.description)}>
            ERC-223 page will launch soon. Come back and check it out.
          </p>
        </div>
      )}
    </>
  );
};
