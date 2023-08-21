import React, { useState } from "react";
import styles from "./Footer.module.scss";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { ConverterIcons } from "../ConverterIcons";
import TokensEth from "../../../public/tokens/eth.json";

const ADDRESS_FOR_DONATION = "0x2ca1377dfa03577ce5bbb815c98eda1ac7632e7d";

export const Footer = () => {
  const { showMessage } = useSnackbar();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerFirstPart}>
        <div className={styles.donationWrapper}>
          <div
            onClick={async () => {
              await navigator.clipboard.writeText(ADDRESS_FOR_DONATION);
              showMessage("Wallet address copied");
            }}
            role="button"
            className={styles.donation}
          >
            <img src="/donat.png" alt="" />
            <div className={styles.donationText}>
              <span className={styles.donationLabel}>
                This is a non-profit project, but donations appreciated:
              </span>
              <div className={styles.addressRow}>
                <span className={styles.donationAddress}>{ADDRESS_FOR_DONATION}</span>
                <div className={styles.copyAddressForDonationsButton}>
                  <ConverterIcons name="copy" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.audits}>
          <p>
            They have been audited by{" "}
            <a target="_blank" href="https://audits.callisto.network/">
              Audits Callisto Network:
            </a>
          </p>
          <div>
            {TokensEth.slice(0, 16).map((token) => (
              <img key={token.contract} alt={token.symbol} src={token.logo} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.footerSecondPart}>
        <div className={styles.footerLinks}>
          <a className={styles.githubButton} target="_blank" href="https://callisto.network">
            <ConverterIcons name="github" size={16} />
            Github
          </a>
          <a target="_blank" href="https://callisto.network">
            Callisto Network
          </a>
          <a target="_blank" href="https://dexaran.github.io/erc223/">
            ERC-223
          </a>
        </div>
        <div>
          <div className={styles.licence}>
            <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.en.html">
              GPLv3
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
