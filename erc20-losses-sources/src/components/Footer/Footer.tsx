import React, { useState } from "react";

import { basePath } from "@/constants/build-config/isProd";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { renderShortAddress } from "@/utils/renderAddress";

import { Icons } from "../atoms/Icons";
import styles from "./Footer.module.scss";

const ADDRESS_FOR_DONATION = "0x2ca1377dfa03577ce5bbb815c98eda1ac7632e7d";

export const Footer = () => {
  const { showMessage } = useSnackbar();

  return (
    <div className={styles.footer}>
      <div className={styles.donationWrapper}>
        <div
          onClick={async () => {
            await navigator.clipboard.writeText(ADDRESS_FOR_DONATION);
            showMessage("Wallet address copied");
          }}
          role="button"
          className={styles.donation}
        >
          <img src={`${basePath}/donat.png`} alt="" />
          <div className={styles.donationText}>
            <span className={styles.donationLabelLarge}>
              This is a non-profit project, but donations appreciated:
            </span>
            <div className={styles.addressRow}>
              <span className={styles.donationLabel}>Donations appreciated:</span>
              <span className={styles.donationAddress}>{ADDRESS_FOR_DONATION}</span>
              <span className={styles.donationAddressMobile}>
                {renderShortAddress(ADDRESS_FOR_DONATION, 14)}
              </span>
              <div className={styles.copyAddressForDonationsButton}>
                <Icons name="copy" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.licence}>
        <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.en.html">
          GPLv3
        </a>
      </div>
      <div className={styles.footerLinks}>
        <a target="_blank" href="https://callisto.network">
          Callisto Network
        </a>
        <a target="_blank" href="https://audits.callisto.network/">
          Audits Callisto Network
        </a>
        <a
          className={styles.githubButton}
          target="_blank"
          href="https://github.com/Dexaran/dexaran.github.io"
        >
          <Icons name="github" size={16} />
          Github
        </a>
      </div>
    </div>
  );
};
