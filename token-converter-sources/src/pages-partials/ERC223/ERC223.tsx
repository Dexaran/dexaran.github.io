import React from "react";
import homeStyles from "../../styles/Home.module.scss";
import styles from "./ERC223.module.scss";
import clsx from "clsx";

const ERC223Content = {
  title: "ERC-223",
  description:
    "Converting tokens from the ERC-20 standard to the ERC-223 standard opens up new possibilities for enhanced security and functionality. This process allows you to transition your tokens to a more advanced standard that aligns with modern security principles and provides improved error handling capabilities. Let's explore how this conversion works step by step.",
  steps: [],
};

export const ERC223 = () => {
  return (
    <>
      <div className={styles.contentBlockHeader}>
        <h1 className={clsx(homeStyles.h1, styles.h1)}>{ERC223Content.title}</h1>
        <p className={clsx(homeStyles.description, styles.description)}>
          {ERC223Content.description}
        </p>
      </div>
    </>
  );
};
