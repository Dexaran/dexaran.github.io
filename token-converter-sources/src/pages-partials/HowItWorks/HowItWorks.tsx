import React from "react";
import homeStyles from "../../styles/Home.module.scss";
import styles from "./HowItWorks.module.scss";
import clsx from "clsx";
import { Content } from "@/constants/content";

export const HowItWorks = () => {
  return (
    <>
      <div className={styles.contentBlockHeader}>
        <h1 className={clsx(homeStyles.h1, styles.h1)}>{Content.howItWorks.title}</h1>
        <p className={clsx(homeStyles.description, styles.description)}>
          {Content.howItWorks.description}
        </p>
        {Content.howItWorks.steps.map((step, index) => (
          <div key={step.title} className={styles.step}>
            <div className={styles.stepNumber}>
              <span>{index + 1}</span>
            </div>
            <div className={styles.stepContent}>
              <p className={styles.stepTitle}>{step.title}</p>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
