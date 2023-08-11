import React, { useState } from "react";
import Modal from '@/components/Modal';
import styles from "./ChangeNetwork.module.scss";
import { ConverterIcons } from "../ConverterIcons";
import { Network, NetworksConfigs } from "./networks";
import { useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";

interface Props {
  title: string,
  url?: string,
  urls?: {
    url: string,
    title: string,  
  }[],
  date: string,
  isHighlighted: boolean,
  onMouseEnter: () => void,
  onMouseLeave: () => void,
}

export default function ChangeNetwork({ }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const {chain, chains} = useNetwork();
  const {disconnect} = useDisconnect();

  const selectedNetwork = Object.values(NetworksConfigs).find(network => network.chainId === chain?.id)
  const {switchNetwork} = useSwitchNetwork()

  if(!selectedNetwork) return null
  return (
    <div className={styles.container}>
      <button className={styles.pickNetworkButton} onClick={() => setIsOpen(true)}>
        <span className={styles.tokenName}>
          Network
        </span>
        <div>
        <span className={styles.tokenName}>
          <img src={selectedNetwork.icon} width="24px" height="24px" alt={selectedNetwork.name} />
          {selectedNetwork.name}
        </span>
        <ConverterIcons name="chevronDown" fill="#C3D8D5" />
        </div>
      </button>
      <button className={styles.disconnectWalletButton} onClick={()=>{disconnect()}}>
        <span className={styles.tokenName}>
          Disconnect wallet
        </span>
      </button>
      <Modal title="Select a network" handleClose={() => setIsOpen(false)} isOpen={isOpen}>
        <div className={styles.networksContainer}>
        {Object.values(NetworksConfigs).map(network => (
          <div key={network.chainId} className={styles.network} onClick={() => { 
            switchNetwork?.(network.chainId)
            setIsOpen(false);
          }}>
            <img src={network.icon} width="32px" height="32px" alt={network.name} />
            <span>{ network.name }</span>
          </div>
        ))}
        </div>
      </Modal>

    </div>
  )
}
