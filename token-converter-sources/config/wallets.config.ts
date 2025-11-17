import { basePath } from "./build/paths";

export const wallets = {
  metamask: {
    name: "Metamask",
    image: `${basePath}/images/wallets/metamask.svg`,
  },
  wc: {
    name: "WalletConnect",
    image: `${basePath}/images/wallets/wc.svg`,
  },
  keystore: {
    name: "Keystore",
    image: `${basePath}/images/wallets/keystore.svg`,
  },
  ledger: {
    name: "Ledger",
    image: `${basePath}/images/wallets/ledger.svg`,
  },
  trustWallet: {
    name: "Trust Wallet",
    image: `${basePath}/images/wallets/trust.svg`,
  },
  coinbase: {
    name: "Coinbase",
    image: `${basePath}/images/wallets/coinbase.svg`,
  },
  safePal: {
    name: "SafePal",
    image: `${basePath}/images/wallets/safepal-logo.svg`,
  },
  unknown: {
    name: "Unknown",
    image: `${basePath}/images/wallets/default.svg`,
  },
} as const;
