/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import clsx from "clsx";
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { NetworksConfigs } from "@/constants/networks";
import { Icons } from "../atoms/Icons";
import Modal from "../atoms/Modal";
import { renderShortAddress } from "@/utils/renderAddress";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useSwipeable } from "react-swipeable";
import Drawer from "../atoms/Drawer/Drawer";
import { createWalletClient, http, publicActions } from "viem";
import { projectId } from "../../constants/config/projectId";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { mainnet, bsc, optimism, polygon } from "wagmi/chains";
import { WalletConnectLegacyConnector } from '@wagmi/core/connectors/walletConnectLegacy'

const callistoCUSTOM = {
  id: 820,
  name: "Callisto Network",
  network: "callisto",
  nativeCurrency: {
    decimals: 18,
    name: "Callisto",
    symbol: "CLO",
  },
  rpcUrls: {
    public: { http: ["https://rpc.callisto.network/"] },
    default: { http: ["https://rpc.callisto.network/"] },
  },
  blockExplorers: {
    default: { name: "CallistoScan", url: "https://explorer.callisto.network" },
  },
  contracts: {
    multicall3: {
      address: "0xA8873640557a928016bFaf8d5D8B98f042A479C9" as any,
    },
  },
};

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

const TabIcons = {
  [Tabs.converter]: "swap2",
  [Tabs.howItWorks]: "faq",
  [Tabs.ERC223]: "erc223",
  [Tabs.addressBalance]: "viewAddress",
};

const CustomNode = () => {
  const [name, setName] = useState("");

  return (
    <div className={styles.customNodeModal}>
      <div className={styles.fieldsLabel}>Node name</div>
      <div className={styles.amountInputWrapper}>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="My ETH Node"
          className={styles.input}
          type="text"
        />
      </div>
      <div className={styles.fieldsLabel}>URL</div>
      <div className={styles.amountInputWrapper}>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="http://127.0.0.1"
          className={styles.input}
          type="text"
        />
      </div>
      <div className={styles.fieldsLabel}>Port</div>
      <div className={styles.amountInputWrapper}>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="8545"
          className={styles.input}
          type="text"
        />
      </div>

      <div className={styles.fieldsLabel}>Network</div>

      <select id="fruit" className={styles.select}>
        {Object.values(NetworksConfigs).map((network) => (
          <option key={network.chainId} value={network.chainId}>
            {network.name}
          </option>
        ))}
      </select>
    </div>
  );
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
  const [isNetworksMenuOpen, setIsNetworksMenuOpen] = useState(false);
  const [isCustomNodeOpen, setIsCustomNodeOpen] = useState(false);
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

  //
  const [menuOpen, setMenuOpen] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      setMenuOpen(false);
    },
  });

  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const customNodeHandler = () => {

    // const walletClient = createWalletClient({
    //   // account,
    //   chain: NetworksConfigs.callisto.chainConfig,
    //   transport: http(),
    // }).extend(publicActions);

    // const connector = new MockConnector({
    //   options: {
    //     walletClient: walletClient,
    //   },
    // });
    // connect({ chainId: 820, connector });

    const connector = new WalletConnectConnector({
      chains: [mainnet, bsc, optimism, polygon],
      options: {
        projectId,
      },
    });

    connect({ connector, chainId: 56 });

    return;
  };
  //
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
              // onClick={() => setIsChangeNetworkOpen(true)}
              onClick={() => setIsNetworksMenuOpen(!isNetworksMenuOpen)}
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
              <Icons
                name="chevronDown"
                fill="#C3D8D5"
                className={clsx(isNetworksMenuOpen && styles.open)}
              />
            </button>
            {isConnected ? (
              <button
                className={styles.pickNetworkButton}
                onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
              >
                <Icons name="wallet" fill="#C3D8D5" />
                <span className={styles.shortWalletAddress}>{renderShortAddress(address, 4)}</span>
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
            <div className={styles.menuButtonWrapper}>
              <button onClick={() => setMenuOpen(true)} className={styles.menuButton}>
                <Icons name="menu" />
              </button>
            </div>

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
            {isNetworksMenuOpen ? (
              <div className={styles.walletNetworksMenu}>
                {Object.values(NetworksConfigs).map((network) => (
                  <div
                    key={network.chainId}
                    className={styles.network}
                    onClick={() => {
                      switchNetwork?.(network.chainId);
                      setDefaultChainId(network.chainId);
                      setIsNetworksMenuOpen(false);
                    }}
                  >
                    <img src={network.icon} width="32px" height="32px" alt={network.name} />
                    <span>{network.name}</span>
                  </div>
                ))}
                {/* <button
                  className={styles.disconnectWallet}
                  onClick={() => {
                    // setIsNetworksMenuOpen(false);
                    customNodeHandler();
                  }}
                >
                  <Icons name="erc223" fill="#C3D8D5" />
                  Use custom node
                </button>

                <button
                  className={styles.disconnectWallet}
                  onClick={() => {
                    setIsNetworksMenuOpen(false);
                    setIsCustomNodeOpen(true);
                  }}
                >
                  <Icons name="add" fill="#C3D8D5" />
                  Add custom node
                </button> */}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <Drawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} position="left">
        <div {...handlers} className={styles.menuWrapper}>
          <div className={styles.menuContent}>
            {Object.keys(Tabs).map((tab: TabType) => (
              <div
                key={tab}
                className={clsx(styles.menuItem, activeTab === tab && styles.active)}
                onClick={() => {
                  setTab(tab);
                  setMenuOpen(false);
                }}
              >
                <Icons name={TabIcons[tab] as any} />
                <span>{TabTitles[tab]}</span>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
      <Modal
        title="Set up your custom node"
        handleClose={() => setIsCustomNodeOpen(false)}
        isOpen={isCustomNodeOpen}
      >
        <CustomNode />
      </Modal>
      {/* <Modal
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
      </Modal> */}
    </>
  );
};
