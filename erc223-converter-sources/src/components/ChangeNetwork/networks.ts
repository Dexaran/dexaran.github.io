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
};

export const NetworksConfigs: {
  [networkName in Network]: NetworkConfig;
} = {
  [Network.mainnet]: {
    name: "Ethereum mainnet",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    chainId: 1,
  },
  [Network.optimism]: {
    name: "Optimism",
    icon: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
    chainId: 10,
  },
  [Network.polygon]: {
    name: "Polygon (MATIC)",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
    chainId: 137,
  },
  [Network.bnb]: {
    name: "BNB Smart Chain",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    chainId: 56,
  },
  [Network.callisto]: {
    name: "Callisto",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2757.png",
    chainId: 820,
  },

  // [Network.etc]: {
  //   name: "Ethereum Classic",
  //   icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png",
  //   chainId: 61,
  // },
  // [Network.bitTorrent]: {
  //   name: "BitTorrent",
  //   icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/16086.png",
  //   chainId: 199,
  // },

};
