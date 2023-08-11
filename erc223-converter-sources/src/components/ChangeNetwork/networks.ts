export enum Network {
  callisto = "clo",
  mainnet = "eth",
  bitTorrent = "bttc",
  bnb = "bnb",
  etc = "etc",
  // arbitrum = "arbitrum",
  // goerli = "goerli",
  // optimism = "optimism",
  // polygon = "polygon",
}

export enum TokenOriginalName {
  ETH = "ETH",
  USDT = "USDT",
  BNB = "BNB",
  SHIB = "SHIB",
  ETC = "ETC",
  FTM = "FTM",
  CAKE = "CAKE",
  BTT = "BTT",
  TWT = "TWT",
  TON = "TON",
  RACA = "RACA",
  REEF = "REEF",
  BAKE = "BAKE",
  LINA = "LINA",
  ZOO = "ZOO",
  WSG = "WSG",
  BCOIN = "BCOIN",
  ANTEX = "ANTEX",
  CLO = "CLO",
  BBT = "BBT",
  XMS = "XMS",
  SOY = "SOY",
}
export type TokenUID = keyof typeof TokenOriginalName;

export type NetworkConfig = {
  name: string;
  symbol: TokenUID;
  icon: string;
  rpc: string;
  explorer: string;
  bridgeContractAddress: string;
  multicallContractAddress: string;
  swapRouterContractAddress: string;
  chainId: number;
  color: string;
};
    
export const NetworksConfigs: {
  [networkName in Network]: NetworkConfig;
} = {
  [Network.callisto]: {
    name: "Callisto",
    symbol: TokenOriginalName.CLO,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2757.png",
    rpc: "https://rpc.callisto.network/",
    explorer: "https://explorer.callisto.network/",
    bridgeContractAddress: "0x9a1fc8C0369D49f3040bF49c1490E7006657ea56",
    multicallContractAddress: "0x8bA3D23241c7044bE703afAF2A728FdBc16f5F6f",
    swapRouterContractAddress: "0xeB5B468fAacC6bBdc14c4aacF0eec38ABCCC13e7",
    chainId: 820,
    color: "#1EF560FF",
  },
  [Network.bnb]: {
    name: "BNB Smart Chain (BEP20)",
    symbol: TokenOriginalName.BNB,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    rpc: "https://bsc-dataseed.binance.org/",
    explorer: "https://bscscan.com/",
    bridgeContractAddress: "0x9a1fc8C0369D49f3040bF49c1490E7006657ea56",
    multicallContractAddress: "0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B",
    swapRouterContractAddress: "",
    chainId: 56,
    color: "#F59C3FFF",
  },
  [Network.bitTorrent]: {
    name: "BitTorrent",
    symbol: TokenOriginalName.BTT,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/16086.png",
    rpc: "https://rpc.bt.io/",
    explorer: "https://scan.bt.io/",
    bridgeContractAddress: "0x9a1fc8C0369D49f3040bF49c1490E7006657ea56",
    multicallContractAddress: "0x8dFbdEEeF41eefd92A663a34331db867CA6581AE",
    swapRouterContractAddress: "0x8Cb2e43e5AEB329de592F7e49B6c454649b61929",
    chainId: 199,
    color: "#F5B402FF",
  },
  [Network.mainnet]: {
    name: "Ethereum mainnet",
    symbol: TokenOriginalName.ETH,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    rpc: "https://mainnet.infura.io/v3/d819f1add1a34a60adab4df578e0e741",
    explorer: "https://etherscan.io/",
    bridgeContractAddress: "0x9a1fc8C0369D49f3040bF49c1490E7006657ea56",
    multicallContractAddress: "",
    swapRouterContractAddress: "",
    chainId: 1,
    color: "#0E3E6B4A",
  },
  [Network.etc]: {
    name: "Ethereum Classic",
    symbol: TokenOriginalName.ETC,
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png",
    rpc: "https://etc.etcdesktop.com",
    explorer: "https://blockscout.com/etc/mainnet/",
    bridgeContractAddress: "0x9a1fc8C0369D49f3040bF49c1490E7006657ea56",
    multicallContractAddress: "0x98194aaA67638498547Df929DF4926C7D0DCD135",
    swapRouterContractAddress: "0x8c5Bba04B2f5CCCe0f8F951D2DE9616BE190070D",
    chainId: 61,
    color: "#F5B402FF",
  },
};
