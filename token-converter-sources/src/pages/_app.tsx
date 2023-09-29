import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { Chain, configureChains, createConfig, WagmiConfig } from "wagmi";
import { Web3Modal } from "@web3modal/react";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { projectId } from "../constants/config/projectId";
import { publicProvider } from "wagmi/providers/public";
import { SnackbarProvider } from "../providers/SnackbarProvider";
import { chains } from "@/utils/networks";

export const { publicClient } = configureChains(chains, [w3mProvider({ projectId }), publicProvider()]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});


const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <SnackbarProvider>
          <Component {...pageProps} />
        </SnackbarProvider>
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
