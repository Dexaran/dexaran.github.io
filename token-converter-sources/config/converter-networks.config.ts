import { Chain, mainnet } from "wagmi/chains";

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
    name: "Ethereum",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    chainId: 1,
    explorerTx: "https://etherscan.io/tx/{tx}",
    explorerToken: "https://etherscan.io/token/{contract}",
    converterContract: "0x1e9d6cba29e4aa4a9e2587b19d3f0e68de9b6552",
    chainConfig: mainnet,
  },
  // optimism: {
  //   name: "Optimism",
  //   icon: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
  //   chainId: 10,
  //   explorerTx: "https://optimistic.etherscan.io/tx/{tx}",
  //   explorerToken: "https://optimistic.etherscan.io/token/{contract}",
  //   converterContract: "0xf0ddb84596C9B52981C2bFf35c8B21d2b8FEd64c",
  //   chainConfig: optimism,
  // },
  // polygon: {
  //   name: "Polygon (MATIC)",
  //   icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
  //   chainId: 137,
  //   explorerTx: "https://polygonscan.com/tx/{tx}",
  //   explorerToken: "https://polygonscan.com/token/{contract}",
  //   converterContract: "0xf0ddb84596C9B52981C2bFf35c8B21d2b8FEd64c",
  //   chainConfig: polygon,
  // },
  // bsc: {
  //   name: "BNB Smart Chain",
  //   icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
  //   chainId: 56,
  //   explorerTx: "https://bscscan.com/tx/{tx}",
  //   explorerToken: "https://bscscan.com/token/{contract}",
  //   converterContract: "0xf0ddb84596C9B52981C2bFf35c8B21d2b8FEd64c",
  //   chainConfig: bsc,
  // },
  // callisto: {
  //     name: "Callisto",
  //     icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2757.png",
  //     chainId: 820,
  //     explorerTx: "https://explorer.callisto.network/tx/{tx}",
  //     explorerToken: "https://explorer.callisto.network/token/{contract}",
  //     converterContract: "0x5714E07b52FCF05EeBE586815062a049D786C3DB",
  //     chainConfig: {
  //         id: 820,
  //         name: "Callisto Network",
  //         network: "callisto",
  //         nativeCurrency: {
  //             decimals: 18,
  //             name: "Callisto",
  //             symbol: "CLO",
  //         },
  //         rpcUrls: {
  //             public: { http: ["https://rpc.callisto.network/"] },
  //             default: { http: ["https://rpc.callisto.network/"] },
  //         },
  //         blockExplorers: {
  //             default: { name: "CallistoScan", url: "https://explorer.callisto.network" },
  //         },
  //         contracts: {
  //             multicall3: {
  //                 address: "0xA8873640557a928016bFaf8d5D8B98f042A479C9",
  //             },
  //         },
  //     },
  // },
  // sepolia: {
  //     name: "Sepolia",
  //     icon: "https://res.cloudinary.com/practicaldev/image/fetch/s--_dX1np3j--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ah1kd81caer88dtqzd56.png",
  //     chainId: 11155111,
  //     explorerTx: "https://sepolia.etherscan.io/tx/{tx}",
  //     explorerToken: "https://sepolia.etherscan.io/token/{contract}",
  //     converterContract: "0x044845FB22B4258d83a6c24b2fB061AFEba7e5b9",
  //     chainConfig: {
  //         ...sepolia,
  //         rpcUrls: {
  //             public: { http: ["https://ethereum-sepolia-rpc.publicnode.com"] },
  //             default: { http: ["https://ethereum-sepolia-rpc.publicnode.com"] },
  //         },
  //     },
  // },
  // bscTestnet: {
  //     name: "Binance Smart Chain Testnet",
  //     icon: "https://seeklogo.com/images/B/binance-smart-chain-bsc-logo-9C34053D61-seeklogo.com.png",
  //     chainId: 97,
  //     explorerTx: "https://testnet.bscscan.com/tx/{tx}",
  //     explorerToken: "https://testnet.bscscan.com/token/{contract}",
  //     converterContract: "0x18EEdef5d3D21C2828Ca8557BeF7210Bfa481bC2",
  //     chainConfig: bscTestnet,
  // },
};
