import React, { useState } from "react";
import styles from "./Footer.module.scss";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { Icons } from "../Icons";
import { basePath } from "@/constants/build-config/isProd";
import { renderShortAddress } from "@/utils/renderAddress";

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
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.50391 5.45801V3.34863C7.50391 2.43457 7.72949 1.74609 8.18066 1.2832C8.6377 0.820312 9.32031 0.588867 10.2285 0.588867H13.5947C14.0693 0.588867 14.4941 0.65625 14.8691 0.791016C15.2441 0.919922 15.5869 1.14551 15.8975 1.46777L20.3359 5.97656C20.6641 6.31641 20.8926 6.67383 21.0215 7.04883C21.1504 7.42383 21.2148 7.88086 21.2148 8.41992V15.5566C21.2148 16.4707 20.9863 17.1592 20.5293 17.6221C20.0781 18.085 19.3984 18.3164 18.4902 18.3164H16.6797V16.9014H18.4111C18.8682 16.9014 19.2139 16.7842 19.4482 16.5498C19.6826 16.3096 19.7998 15.9697 19.7998 15.5303V8.01562H15.6865C15.1826 8.01562 14.8047 7.89258 14.5527 7.64648C14.3066 7.40039 14.1836 7.02246 14.1836 6.5127V2.00391H10.2988C9.8418 2.00391 9.49609 2.12402 9.26172 2.36426C9.0332 2.59863 8.91895 2.93555 8.91895 3.375V5.45801H7.50391ZM15.458 6.30176C15.458 6.45996 15.4902 6.57422 15.5547 6.64453C15.625 6.70898 15.7363 6.74121 15.8887 6.74121H19.4307L15.458 2.69824V6.30176ZM3.24121 19.9424V7.73438C3.24121 6.82031 3.4668 6.13184 3.91797 5.66895C4.375 5.20605 5.05762 4.97461 5.96582 4.97461H9.06836C9.56055 4.97461 9.96777 5.02734 10.29 5.13281C10.6123 5.23828 10.9404 5.46387 11.2744 5.80957L16.1172 10.7402C16.3516 10.9805 16.5273 11.209 16.6445 11.4258C16.7676 11.6367 16.8496 11.8711 16.8906 12.1289C16.9316 12.3867 16.9521 12.7031 16.9521 13.0781V19.9424C16.9521 20.8564 16.7236 21.5449 16.2666 22.0078C15.8154 22.4707 15.1357 22.7021 14.2275 22.7021H5.96582C5.05762 22.7021 4.375 22.4707 3.91797 22.0078C3.4668 21.5508 3.24121 20.8623 3.24121 19.9424ZM4.65625 19.916C4.65625 20.3555 4.77051 20.6924 4.99902 20.9268C5.2334 21.167 5.57617 21.2871 6.02734 21.2871H14.1572C14.6084 21.2871 14.9512 21.167 15.1855 20.9268C15.4199 20.6924 15.5371 20.3555 15.5371 19.916V13.1484H10.5713C10.0264 13.1484 9.61328 13.0107 9.33203 12.7354C9.05664 12.46 8.91895 12.0439 8.91895 11.4873V6.38965H6.03613C5.5791 6.38965 5.2334 6.50977 4.99902 6.75C4.77051 6.98438 4.65625 7.31836 4.65625 7.75195V19.916ZM10.7383 11.8213H15.2646L10.2461 6.71484V11.3291C10.2461 11.5049 10.2842 11.6309 10.3604 11.707C10.4365 11.7832 10.5625 11.8213 10.7383 11.8213Z"
                    fill="currentColor"
                  />
                </svg>
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
