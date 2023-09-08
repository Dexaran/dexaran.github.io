export enum Network {
  callisto = "clo",
  mainnet = "eth",
  // bitTorrent = "bttc",
  bnb = "bnb",
  // etc = "etc",
  // arbitrum = "arbitrum",
  // goerli = "goerli",
  optimism = "optimism",
  polygon = "polygon",
}

export type NetworkConfig = {
  name: string;
  icon: string;
  chainId: number;
  explorerTx: string;
  explorerToken: string;
};

export const NetworksConfigs: {
  [networkName in Network]: NetworkConfig;
} = {
  [Network.mainnet]: {
    name: "Ethereum mainnet",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    chainId: 1,
    explorerTx: "https://etherscan.io/tx/{tx}",
    explorerToken: "https://etherscan.io/token/{contract}",
  },
  [Network.optimism]: {
    name: "Optimism",
    icon: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
    chainId: 10,
    explorerTx: "https://optimistic.etherscan.io/tx/{tx}",
    explorerToken: "https://optimistic.etherscan.io/token/{contract}",
  },
  [Network.polygon]: {
    name: "Polygon (MATIC)",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
    chainId: 137,
    explorerTx: "https://polygonscan.com/tx/{tx}",
    explorerToken: "https://polygonscan.com/token/{contract}",
  },
  [Network.bnb]: {
    name: "BNB Smart Chain",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    chainId: 56,
    explorerTx: "https://bscscan.com/tx/{tx}",
    explorerToken: "https://bscscan.com/token/{contract}",
  },
  [Network.callisto]: {
    name: "Callisto",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2757.png",
    chainId: 820,
    explorerTx: "https://explorer.callisto.network/tx/{tx}",
    explorerToken: "https://explorer.callisto.network/token/{contract}",
  },
};

export const getNetworkExplorerTxUrl = (chainId: number, txHash: string) => {
  const networkConfig = Object.values(NetworksConfigs).find(config => config.chainId === chainId);
  if(!networkConfig || !txHash) return "#";
  return networkConfig.explorerTx.replace("{tx}", txHash);
}

export const getNetworkExplorerTokenUrl = (chainId: number, contractAddress: string) => {
  const networkConfig = Object.values(NetworksConfigs).find(config => config.chainId === chainId);
  if(!networkConfig || !contractAddress) return "#";
  return networkConfig.explorerToken.replace("{contract}", contractAddress);
}
