/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "./Header.module.scss";
import clsx from "clsx";
import { basePath } from "@/constants/build-config/isProd";


export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.leftHeader}>
          <img className={clsx(styles.headerImage)} src={`${basePath}/left-header-1.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/left-header-2.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/left-header-3.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/left-header-4.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/left-header-5.png`} alt="" />
        </div>

        <h1>ERC-20 Losses Calculator</h1>
        <h2>
          ERC-20 token standard contains a security flaw in its transferring workflow. As the result
          a user can lose their funds.
        </h2>
        <h3>The problem</h3>
        <p>
          {`ERC-20 standard implements two methods of transferring tokens. One is designed for address-to-address transfers, another is designed for contract deposits. Both methods do not implement error handling which is a major security flaw. By the standard the burden of determining the method of transferring tokens is placed on the user and in case of picking a "wrong" method for a contract deposit the tokens get permanently stuck.`}
        </p>
        <p>
          You can find a full description of the problem in{" "}
          <a
            href="https://dexaran820.medium.com/known-problems-of-erc20-token-standard-e98887b9532c"
            target="_blank"
            rel="noopener noreferrer"
          >
            this article
          </a>{" "}
          or in{" "}
          <a
            href="https://github.com/Dexaran/EIPs/blob/patch-1/EIPS/eip-7544.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            EIP-7544
          </a>
          .
        </p>
        <h3>What this script does?</h3>
        <p>
          For each token contract address in a left input the script calculates how much of this
          token is permanently stuck in all the addresses from the right input. NOTE: It can take
          few hours to go through thousands of tokens from the default list
        </p>
        <h3>Found a problem with the script?</h3>
        <p>
          Report it{" "}
          <a
            href="https://github.com/Dexaran/dexaran.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
        </p>
        <h3>Lorem</h3>
        <p>
          LOREM For each token contract address in a left input the script calculates how much of
          this token is permanently stuck in all the addresses from the right input. NOTE: It can
          take few hours to go through thousands of tokens from the default list
        </p>
        <img
          className={styles.screenshot}
          src={`${basePath}/lost-tokens-etherscan.png`}
          alt="lost-tokens-etherscan"
        />

        <div className={styles.rightHeader}>
          <img className={clsx(styles.headerImage)} src={`${basePath}/right-header-1.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/right-header-2.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/right-header-3.png`} alt="" />
          <img className={clsx(styles.headerImage)} src={`${basePath}/right-header-4.png`} alt="" />
        </div>
      </div>
    </header>
  );
};
