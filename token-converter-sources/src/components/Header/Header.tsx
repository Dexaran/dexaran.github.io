/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import clsx from "clsx";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { NetworksConfigs } from "@/constants/networks";
import { Icons } from "../atoms/Icons";
import Modal from "../atoms/Modal";
import { renderShortAddress } from "@/utils/renderAddress";
import { useSnackbar } from "@/providers/SnackbarProvider";

enum Tabs {
  "converter" = "converter",
  "howItWorks" = "howItWorks",
  "ERC223" = "ERC223",
  "addressBalance" = "addressBalance",
}
export type TabType = keyof typeof Tabs;

const TabTitles = {
  [Tabs.converter]: "Convert Tokens",
  [Tabs.howItWorks]: "How it works",
  [Tabs.ERC223]: "ERC-223",
  [Tabs.addressBalance]: "View address tokens",
};
export const Header = ({
  tab: activeTab,
  setTab,
  defaultChainId,
  setDefaultChainId,
  isChangeNetworkOpen,
  setIsChangeNetworkOpen,
}: {
  tab: TabType;
  setTab: (tab: TabType) => void;
  defaultChainId: number;
  setDefaultChainId: (chainId: number) => void;
  isChangeNetworkOpen: boolean;
  setIsChangeNetworkOpen: (isOpen: boolean) => void;
}) => {
  const [isClientSide, setIsClientSide] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const { open } = useWeb3Modal();

  const selectedNetwork = Object.values(NetworksConfigs).find(
    (network) => network.chainId === (chain?.id || defaultChainId),
  );
  const { switchNetwork } = useSwitchNetwork();
  const { showMessage } = useSnackbar();

  useEffect(() => {
    setIsClientSide(true);
  }, [setIsClientSide]);

  // if (!isClientSide) return null;
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerTabs}>
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
        {isClientSide ? (
          <div className={styles.headerSettings}>
            <button
              className={styles.pickNetworkButton}
              onClick={() => setIsChangeNetworkOpen(true)}
            >
              {selectedNetwork ? (
                <>
                  <img
                    src={selectedNetwork.icon}
                    width="24px"
                    height="24px"
                    alt={selectedNetwork.name}
                    key={selectedNetwork.name}
                  />
                  {selectedNetwork.name}
                </>
              ) : (
                "Select networks"
              )}
              <Icons name="chevronDown" fill="#C3D8D5" />
            </button>
            {isConnected ? (
              <button
                className={styles.pickNetworkButton}
                onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
              >
                <Icons name="wallet" fill="#C3D8D5" />
                {renderShortAddress(address, 4)}
                <Icons
                  name="chevronDown"
                  fill="#C3D8D5"
                  className={clsx(isWalletMenuOpen && styles.open)}
                />
              </button>
            ) : (
              <button className={styles.pickNetworkButton} onClick={() => open()}>
                <span>Connect Wallet</span>
              </button>
            )}
            {isWalletMenuOpen ? (
              <div className={styles.walletMenu}>
                <div
                  className={styles.walletAddress}
                  onClick={async () => {
                    await navigator.clipboard.writeText(address);
                    showMessage("Wallet Token address copied");
                  }}
                >
                  <span>Your address: </span>
                  <span className={styles.address}>{`${renderShortAddress(address, 4)}`}</span>
                  <Icons name="copy" />
                </div>
                <button
                  className={styles.disconnectWallet}
                  onClick={() => {
                    disconnect();
                    setIsWalletMenuOpen(false);
                  }}
                >
                  <Icons name="logout" fill="#C3D8D5" />
                  Disconnect wallet
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <Modal
        title="Select a network"
        handleClose={() => setIsChangeNetworkOpen(false)}
        isOpen={isChangeNetworkOpen}
      >
        <div className={styles.networksContainer}>
          {Object.values(NetworksConfigs).map((network) => (
            <div
              key={network.chainId}
              className={styles.network}
              onClick={() => {
                switchNetwork?.(network.chainId);
                setDefaultChainId(network.chainId);
                setIsChangeNetworkOpen(false);
              }}
            >
              <img src={network.icon} width="32px" height="32px" alt={network.name} />
              <span>{network.name}</span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
