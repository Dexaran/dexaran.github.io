import '../styles/globals.scss'
import type {AppProps} from 'next/app'
import {Chain, configureChains, createConfig, WagmiConfig} from "wagmi";
import { Web3Modal } from '@web3modal/react';
import {EthereumClient, w3mConnectors, w3mProvider} from "@web3modal/ethereum";
import {projectId} from "../constants/config/projectId";
import {mainnet, bsc} from "wagmi/chains";
import {callisto} from "../constants/chains/clo";
import { publicProvider } from 'wagmi/providers/public';

const chains = [mainnet as Chain, bsc as Chain, callisto as Chain];

const { publicClient } = configureChains(chains, [w3mProvider({projectId}), publicProvider()]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({projectId, chains}),
  publicClient
});

const ethereumClient = new EthereumClient(wagmiConfig, chains)

export default function App({Component, pageProps}: AppProps) {
  return <>
    <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiConfig>

    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </>
}
