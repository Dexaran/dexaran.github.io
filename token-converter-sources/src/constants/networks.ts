import { Chain } from "wagmi";
import { mainnet, bsc, optimism, polygon } from "wagmi/chains";

export const NetworksConfigs: {
  [networkName: string]: {
    name: string;
    icon: string;
    chainId: number;
    explorerTx: string;
    explorerToken: string;
    converterContract: string;
    chainConfig: Chain;
  };
} = {
  mainnet: {
    name: "Ethereum mainnet",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    chainId: 1,
    explorerTx: "https://etherscan.io/tx/{tx}",
    explorerToken: "https://etherscan.io/token/{contract}",
    converterContract: "0xc68AD4DDCB3C9cAd52852E6dF7102b77c32865A5",
    chainConfig: mainnet,
  },
  optimism: {
    name: "Optimism",
    icon: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
    chainId: 10,
    explorerTx: "https://optimistic.etherscan.io/tx/{tx}",
    explorerToken: "https://optimistic.etherscan.io/token/{contract}",
    converterContract: "0xc68AD4DDCB3C9cAd52852E6dF7102b77c32865A5",
    chainConfig: optimism,
  },
  polygon: {
    name: "Polygon (MATIC)",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
    chainId: 137,
    explorerTx: "https://polygonscan.com/tx/{tx}",
    explorerToken: "https://polygonscan.com/token/{contract}",
    converterContract: "0xc68AD4DDCB3C9cAd52852E6dF7102b77c32865A5",
    chainConfig: polygon,
  },
  bsc: {
    name: "BNB Smart Chain",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    chainId: 56,
    explorerTx: "https://bscscan.com/tx/{tx}",
    explorerToken: "https://bscscan.com/token/{contract}",
    converterContract: "0xc68AD4DDCB3C9cAd52852E6dF7102b77c32865A5",
    chainConfig: bsc,
  },
  callisto: {
    name: "Callisto",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2757.png",
    chainId: 820,
    explorerTx: "https://explorer.callisto.network/tx/{tx}",
    explorerToken: "https://explorer.callisto.network/token/{contract}",
    converterContract: "0xc68AD4DDCB3C9cAd52852E6dF7102b77c32865A5",
    chainConfig: {
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
          address: "0xA8873640557a928016bFaf8d5D8B98f042A479C9",
        },
      },
    },
  },
};
