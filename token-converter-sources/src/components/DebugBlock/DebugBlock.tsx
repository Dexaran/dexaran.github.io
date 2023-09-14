import React, { useMemo } from "react";
import styles from "./DebugBlock.module.scss";
import {
  Address,
  useAccount,
  useConnect,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, parseEther, publicActions } from "viem";
import { callisto } from "@/constants/chains/clo";
import { MockConnector } from "wagmi/connectors/mock";
import testTokenABI from "../../constants/abi/test-token.json";
import { useWeb3Modal } from "@web3modal/react";
import { supportedChainIds } from "@/utils/networks";

const TEST_WALLET_PK = "0x667b7fdbb728769abe46c01d71465a213342cddeb5b1d9162ca0676c6a3f659a";
const TEST_TOKEN_ERC20_ADDRESS: Address = "0x9e3549954138E52C230aCB92A9358C3842ABEb41";

const TestKeystore = () => {
  const { connector: activeConnector, isConnected } = useAccount();

  const account = privateKeyToAccount(TEST_WALLET_PK);
  const walletClient = createWalletClient({
    account,
    chain: callisto,
    transport: http(),
  }).extend(publicActions);

  const connector = new MockConnector({
    options: {
      walletClient: walletClient,
    },
  });

  const { connect, connectors, error, isLoading, pendingConnector } = useConnect({
    connector,
  });

  return (
    <>
      {isConnected && <div>Connected to {activeConnector?.name}</div>}

      <button disabled={!connector.ready} key={connector.id} onClick={() => connect({ connector })}>
        {connector.name}
        {isLoading && pendingConnector?.id === connector.id && " (connecting)"}
      </button>

      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {isLoading && pendingConnector?.id === connector.id && " (connecting)"}
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </>
  );
};

export const DebugBlock = () => {
  const { isConnected, address } = useAccount();
  const { chain, chains } = useNetwork();

  const isNetworkSupported = useMemo(() => {
    if (chain?.id && supportedChainIds.includes(chain.id)) {
      return true;
    }

    return false;
  }, [chain]);

  const { config: configGiveAway } = usePrepareContractWrite({
    address: TEST_TOKEN_ERC20_ADDRESS as any,
    abi: testTokenABI,
    functionName: "giveAway",
    args: [parseEther("100")],
  });

  const { isLoading, isSuccess, write } = useContractWrite(configGiveAway);
  const { open, close, setDefaultChain } = useWeb3Modal();

  return (
    <div className={styles.temporaryBlock}>
      <div className={styles.converterFieldsLabel}>This block is temporary and will be removed</div>
      {isConnected && (
        <div className={styles.buttons}>
          <button disabled={!isNetworkSupported} onClick={write} className={styles.getTestTokens}>
            Get 100 test tokens
          </button>
          <button onClick={open} className={styles.getTestTokens}>
            Wallet
          </button>
        </div>
      )}

      <div className={styles.address}>Account: {address ? address : "Not connected"}</div>
      <div />
      <TestKeystore />
    </div>
  );
};
