import { IArticle } from "../types";

export const articles: IArticle[] = [
  {
    title: "Known problems of ERC-20 standard.",
    description: "Lack of transaction handling, pull transactions",
    url: "https://dexaran820.medium.com/known-problems-of-erc20-token-standard-e98887b9532c",
    image: "erc-20-known-problems.png",
  },
  {
    title: "ERC-20 approve & transferFrom methods pose a threat to safety of users funds",
    description: "The article describes Pull tx VS Push tx approach",
    url: "https://dexaran820.medium.com/erc-20-approve-transferfrom-asset-transfer-method-poses-a-threat-to-users-funds-safety-ff7195127018",
    image: "approvals.png",
  },
  {
    title: "Callisto Security statement regarding ERC-20 standard.",
    description: "Statement by the security auditing organization",
    url: "https://callisto.network/erc-20-standard-callisto-network-security-department-statement/",
    image: "callisto-statement.png",
  },
  {
    title: "Cryptonomist: ERC-223",
    description:
      "The token standard by hacker Dexaran has been added to Ethereum’s list of standards",
    url: "https://en.cryptonomist.ch/2023/07/31/erc-223-lands-among-ethereum-standars/",
    image: "cryptonomist.png",
  },
  {
    title: "Dexaran's interview regarding ERC-20, ERC-223 and ERC-777 development",
    description: "",
    url: "https://www.cointelligence.com/content/comparison-erc20-erc223-new-ethereum-erc777-token-standard/?ref=hackernoon.com",
    image: "cointelligence-interview.png",
  },
  {
    title: "Dexarans interview with CryptoInsidersHK",
    description: "",
    url: "https://cryptoinsiders.online/understanding-erc-223-tokens-a-safer-approach-to-gas-fees-and-enhanced-security/",
    image: "crypto-insiders.png",
  },
  {
    title: "ERC-20 vs ERC-223 vs ERC-777",
    description: "Third party media describes the research on token standards",
    url: "https://101blockchains.com/erc20-vs-erc223-vs-erc777/",
    image: "101blockchain.png",
  },
  {
    title: "Cryptopolitan announces ERC-223 standard",
    description: "Third party media publication",
    url: "https://www.cryptopolitan.com/ethereum-implements-new-token-standard/",
    image: "cryptopolitan.png",
  },
];
