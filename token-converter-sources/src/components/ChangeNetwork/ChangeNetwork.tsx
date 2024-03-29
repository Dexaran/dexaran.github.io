import React, { useState } from "react";
import Modal from "@/components/atoms/Modal";
import styles from "./ChangeNetwork.module.scss";
import { Icons } from "../atoms/Icons";
import { NetworksConfigs } from "../../constants/networks";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";

interface Props {
  title: string;
  url?: string;
  urls?: {
    url: string;
    title: string;
  }[];
  date: string;
  isHighlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ChangeNetwork({
  defaultChainId,
  setDefaultChainId,
  isOpen,
  setIsOpen,
}: {
  defaultChainId: number;
  setDefaultChainId: any;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const selectedNetwork = Object.values(NetworksConfigs).find(
    (network) => network.chainId === (chain?.id || defaultChainId),
  );
  const { switchNetwork } = useSwitchNetwork();

  return (
    <div className={styles.container}>
      <button className={styles.pickNetworkButton} onClick={() => setIsOpen(true)}>
        <span className={styles.tokenName}>Network</span>
        <div>
          {selectedNetwork ? (
            <span className={styles.tokenName}>
              <img
                src={selectedNetwork.icon}
                width="24px"
                height="24px"
                alt={selectedNetwork.name}
              />
              {selectedNetwork.name}
            </span>
          ) : (
            <span className={styles.tokenName}>Select networks</span>
          )}
          <Icons name="chevronDown" fill="#C3D8D5" />
        </div>
      </button>
      {isConnected ? (
        <button
          className={styles.disconnectWalletButton}
          onClick={() => {
            disconnect();
          }}
        >
          <span className={styles.tokenName}>Disconnect wallet</span>
        </button>
      ) : (
        <button className={styles.disconnectWalletButton} onClick={open}>
          <span className={styles.tokenName}>Connect wallet</span>
        </button>
      )}
      <Modal title="Select a network" handleClose={() => setIsOpen(false)} isOpen={isOpen}>
        <div className={styles.networksContainer}>
          {Object.values(NetworksConfigs).map((network) => (
            <div
              key={network.chainId}
              className={styles.network}
              onClick={() => {
                switchNetwork?.(network.chainId);
                setDefaultChainId(network.chainId);
                setIsOpen(false);
              }}
            >
              <img src={network.icon} width="32px" height="32px" alt={network.name} />
              <span>{network.name}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
