import React, { useState } from "react";
import styles from "./Header.module.scss";
import clsx from "clsx";

enum Tabs {
  "converter" = "converter",
  "howItWorks" = "howItWorks",
  "ERC223" = "ERC223",
}
export type TabType = keyof typeof Tabs;

const TabTitles = {
  [Tabs.converter]: "Convert Tokens",
  [Tabs.howItWorks]: "How it works",
  [Tabs.ERC223]: "ERC-223",
};
export const Header = ({
  tab: activeTab,
  setTab,
}: {
  tab: TabType;
  setTab: (tab: TabType) => void;
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        {Object.keys(Tabs).map((tab: TabType) => (
          <div
            key={tab}
            className={clsx(styles.tab, activeTab === tab && styles.active)}
            onClick={() => {
              setTab(tab);
            }}
          >
            <span>{TabTitles[tab]}</span>
            <div
              className={clsx(
                styles.headerUnderline,
                activeTab === tab && styles.headerActiveUnderline,
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
