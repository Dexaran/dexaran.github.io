import eth_contracts from "@/constants/contracts.json";
import eth_tokens from "@/constants/tokens.json";

export const bsc_tokens = [
  "0xad29abb318791d579433d831ed122afeaf29dcfe", // FTM
  "0x55d398326f99059ff775485246999027b3197955", // USDT
  "0x4B0F1812e5Df2A09796481Ff14017e6005508003", // TWT
  "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
  "0xba2ae424d960c26247dd6c32edc70b295c744c43", // DOGE
  "0x12BB890508c125661E03b09EC06E404bc9289040", // RACA
  "0x76a797a59ba2c17726896976b7b3747bfd1d220f", // TON
  "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95", // BANANA
  "0xf21768ccbc73ea5b6fd3c687208a7c2def2d966e", // REEF
  "0x6810e776880c02933d47db1b9fc05908e5386b96", // [invalid] token
];

export const bsc_contracts = ["0xad29abb318791d579433d831ed122afeaf29dcfe"];

export const polygon_tokens = [
  "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT
  "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
  "0x3a3df212b7aa91aa0402b9035b098891d276572b", // FISH
];

export const polygon_contracts = ["0xc2132D05D31c914a87C6611C10748AEb04B58e8F"];

// export const contracts
export const contracts = {
  eth: eth_contracts,
  bsc: bsc_contracts,
  polygon: polygon_contracts,
};

// export const tokens
export const tokens = {
  eth: eth_tokens,
  bsc: bsc_tokens,
  polygon: polygon_tokens,
};

// export const rpcMap
export const rpcMap = new Map([
  ["eth", "https://rpc.mevblocker.io"], // https://eth.meowrpc.com'], // 'https://ethereum.publicnode.com'], // 'https://eth.llamarpc.com' // https://rpc.eth.gateway.fm
  ["eth2", "https://eth.meowrpc.com"],
  ["bsc", "https://binance.llamarpc.com"],
  ["polygon", "https://polygon.llamarpc.com"],
]);

export const ethRpcArray = [
  "https://eth.meowrpc.com", // 0:40
  "https://eth.meowrpc.com", // 0:40
  "https://eth.meowrpc.com", // 0:40
  "https://eth.meowrpc.com", // 0:40
  "https://eth.meowrpc.com", // 0:40
  "https://eth.meowrpc.com", // 0:40
  "https://eth.meowrpc.com", // 0:40
  "https://rpc.mevblocker.io/", // 0:40
  "https://rpc.mevblocker.io/", // 0:40
  "https://rpc.mevblocker.io/", // 0:40
  "https://rpc.mevblocker.io/", // 0:40
  "https://rpc.mevblocker.io/", // 0:40
  "https://rpc.mevblocker.io/", // 0:40
  "https://rpc.mevblocker.io/", // 0:40
  // 'https://ethereum.blockpi.network/v1/rpc/public', // 0:40
  // 'https://ethereum.blockpi.network/v1/rpc/public', // 0:40
  // 'https://ethereum.blockpi.network/v1/rpc/public', // 0:40
  // 'https://ethereum.blockpi.network/v1/rpc/public', // 0:40
  // 'https://ethereum.blockpi.network/v1/rpc/public', // 0:40
  // 'https://ethereum.blockpi.network/v1/rpc/public', // 0:40
  "https://eth.drpc.org", // 0:40  // disabled
  // 'https://eth.drpc.org', // 0:40  // disabled
  // 'https://eth.drpc.org', // 0:40  // disabled
  // 'https://eth-rpc.gateway.pokt.network',  // 1:10
  "https://eth-rpc.gateway.pokt.network", // 1:10
  "https://eth.llamarpc.com", // 1:50 // disabled
  "https://eth.llamarpc.com", // 1:50 // disabled
  "https://ethereum.publicnode.com", // 1:57
  "https://ethereum.publicnode.com", // 1:57

  "https://eth-mainnet.public.blastapi.io", // bad
  "https://eth-mainnet.public.blastapi.io", // bad
  "https://eth-mainnet.public.blastapi.io", // bad
  "https://rpc.payload.de", // bad // disabled
  "https://1rpc.io/eth", // 1:06 (with errors) // disabled
  "https://rpc.ankr.com/eth", // bad // disabled
  "https://core.gashawk.io/rpc", // timeout // disabled
  "https://api.securerpc.com/v1", // bad // disabled
  "https://cloudflare-eth.com", // bad // disabled

  // 'https://rpc.eth.gateway.fm',    // bad // disabled x2
  // 'https://api.zmok.io/mainnet/oaen6dy8ff6hju9k',  // bad // disabled x2
  // 'https://uk.rpc.blxrbdn.com',    // bad // disabled x2
  // 'https://virginia.rpc.blxrbdn.com',  // bad // disabled x2
  // 'https://singapore.rpc.blxrbdn.com', // bad // disabled x2
  // 'https://eth.api.onfinality.io/public', // bad // disabled x2
  // 'https://eth-mainnet-public.unifra.io', // bad // disabled x2
  // 'https://mainnet.gateway.tenderly.co', // bad // disabled x2
];

// export const ERC20
export const ERC20 = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
];
export const ERC20n = [
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    type: "function",
  },
];

// module.exports = { ERC20, rpcMap, tokens, contracts }
