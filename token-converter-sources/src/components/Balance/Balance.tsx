import React from "react";
import styles from "./Balance.module.scss";
import { useAccount, useNetwork, useToken } from "wagmi";
import { renderShortAddress } from "@/utils/renderAddress";
import { Icons } from "../atoms/Icons";
import { getNetworkExplorerTokenUrl } from "@/utils/networks";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { basePath } from "@/constants/build-config/isProd";

export default function Balance({
  tokenAddressERC20,
  tokenAddressERC223,
  tokenBalanceERC20,
  tokenBalanceERC223,
  logo,
  defaultChainId,
  toERC223,
  isAddressLoading,
}: {
  tokenAddressERC20: any;
  tokenAddressERC223: any;
  tokenBalanceERC20: any;
  tokenBalanceERC223: any;
  logo?: string;
  defaultChainId: number;
  toERC223: boolean;
  isAddressLoading: boolean;
}) {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: tokenDataERC20 } = useToken({
    address: tokenAddressERC20,
    chainId: chain?.id || defaultChainId,
  });
  const { data: tokenDataERC223 } = useToken({
    address: tokenAddressERC223,
    chainId: chain?.id || defaultChainId,
  });
  const { showMessage } = useSnackbar();

  const tokenName = tokenDataERC20?.name || tokenDataERC223?.name;
  if (!isConnected) return null;
  return (
    <div className={styles.balance}>
      <span className={styles.balanceTitle} style={{ order: 1 }}>
        Balance:
      </span>
      <div className={styles.balanceToken} style={{ order: toERC223 ? 2 : 4 }}>
        <div className={styles.logoContainer}>
          <img
            src={logo || `${basePath}/token-default.svg`}
            width="44px"
            height="44px"
            alt={tokenAddressERC20}
          />
          <span className={styles.tagErc20}>ERC-20</span>
        </div>
        <div className={styles.tokenContent}>
          <div className={styles.tokenTitle}>
            <span>{tokenName}</span>
            <span>
              {tokenBalanceERC20?.formatted || 0} {tokenDataERC20?.symbol}
            </span>
          </div>
          <div className={styles.tokenDescription}>
            <span>Token contract: </span>
            <div className={styles.address}>
              {tokenAddressERC20 ? (
                <>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={getNetworkExplorerTokenUrl(chain?.id, tokenAddressERC20)}
                  >{`${renderShortAddress(tokenAddressERC20, 12)}`}</a>
                  <Icons
                    name="copy"
                    onClick={async () => {
                      await navigator.clipboard.writeText(tokenAddressERC20);
                      showMessage("ERC-20 Token address copied");
                    }}
                  />
                </>
              ) : (
                "not deployed yet"
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.divider} style={{ order: 3 }} />
      <div className={styles.balanceToken} style={{ order: toERC223 ? 4 : 2 }}>
        <div className={styles.logoContainer}>
          <img
            src={logo || `${basePath}/token-default.svg`}
            width="44px"
            height="44px"
            alt={tokenAddressERC223}
          />
          <span className={styles.tagErc223}>ERC-223</span>
        </div>
        <div className={styles.tokenContent}>
          <div className={styles.tokenTitle}>
            <span>{tokenName}</span>
            <span>
              {tokenBalanceERC223?.formatted || 0} {tokenDataERC223?.symbol}
            </span>
          </div>
          <div className={styles.tokenDescription}>
            <span>Token contract: </span>
            <div className={styles.address}>
              {tokenAddressERC223 ? (
                <>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={getNetworkExplorerTokenUrl(chain?.id, tokenAddressERC223)}
                  >{`${renderShortAddress(tokenAddressERC223, 12)}`}</a>
                  <Icons
                    name="copy"
                    onClick={async () => {
                      await navigator.clipboard.writeText(tokenAddressERC223);
                      showMessage("ERC-223 Token address copied");
                    }}
                  />
                </>
              ) : isAddressLoading ? (
                "Loading..."
              ) : (
                "not deployed yet"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
