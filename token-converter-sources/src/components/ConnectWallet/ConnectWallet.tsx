import React, { useRef, useState } from "react";
import Wallet, { thirdparty } from "ethereumjs-wallet";
import { useWeb3Modal } from "@web3modal/react";
import styles from "./ConnectWallet.module.scss";
import Modal from "../atoms/Modal";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, publicActions } from "viem";
import { MockConnector } from "wagmi/connectors/mock";
import { useConnect } from "wagmi";
import { PrimaryButton, SecondaryButton } from "../atoms/Button/Button";
import { NetworksConfigs } from "@/constants/networks";

/* These needs to be changed further due to the new async library */
const fromMyEtherWalletV2 = (json) => {
  if (json.privKey.length !== 64) {
    throw new Error("Invalid private key length");
  }
  const privKey = new Buffer(json.privKey, "hex");
  return new Wallet(privKey);
};

const getWalletFromPrivKeyFile = (jsonfile, password) => {
  if (jsonfile.encseed != null) return Wallet.fromEthSale(jsonfile, password);
  else if (jsonfile.Crypto != null || jsonfile.crypto != null)
    return Wallet.fromV3(jsonfile, password, true);
  else if (jsonfile.hash != null) return thirdparty.fromEtherWallet(jsonfile, password);
  else if (jsonfile.publisher == "MyEtherWallet") return fromMyEtherWalletV2(jsonfile);
  throw new Error("Invalid Wallet file");
};

const unlockKeystore = async (file, password) => {
  const newFile = {};
  // Small hack because non strict wasn't working..
  Object.keys(file).forEach((key) => {
    newFile[key.toLowerCase()] = file[key];
  });

  return getWalletFromPrivKeyFile(newFile, password);
};

export const ConnectWallet = () => {
  const { open, close, setDefaultChain, isOpen } = useWeb3Modal();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [keystore, setKeystore] = useState(null);
  const fileInput = useRef(null as any);
  const [isUnlockingKeystore, setIsUnlockingKeystore] = useState(false);
  const [password, setPassword] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContents: any = e.target.result;
        const parsedJson = JSON.parse(fileContents);
        setKeystore(parsedJson);
      };
      reader.readAsText(file);
    } else {
      setKeystore(null);
    }
  };

  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

  const importKeystoreFileHandler = async () => {
    setIsUnlockingKeystore(true);
    try {
      const result = await unlockKeystore(keystore, password);
      const PK: any = result?.getPrivateKeyString && result?.getPrivateKeyString();
      if (PK) {
        const account = privateKeyToAccount(PK);
        const walletClient = createWalletClient({
          account,
          chain: NetworksConfigs.mainnet.chainConfig,
          transport: http(),
        }).extend(publicActions);

        const connector = new MockConnector({
          options: {
            walletClient: walletClient,
          },
        });
        connect({ chainId: 1, connector });
      }
      setIsUnlockingKeystore(false);
    } catch (error) {
      console.log("importKeystoreFileHandler ~ error:", error);
      setIsUnlockingKeystore(false);
    }
  };

  return (
    <div className={styles.actionButtonWrapper}>
      <PrimaryButton onClick={open} isLoading={isOpen}>
        Connect wallet
      </PrimaryButton>
      <SecondaryButton
        onClick={() => setIsImportOpen(true)}
        isLoading={isImportOpen}
        style={{ marginTop: "20px" }}
      >
        Import Keystore File
      </SecondaryButton>
      <Modal
        title="Import Keystore File"
        handleClose={() => setIsImportOpen(false)}
        isOpen={isImportOpen}
      >
        <div className={styles.importModalContainer}>
          <div className={styles.browseContainer}>
            <p>Select your Keystore File</p>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              ref={fileInput}
            />
            <button onClick={() => fileInput.current?.click()} className={styles.browseButton}>
              Select file
            </button>
            <p>{selectedFile?.name && `Selected file: ${selectedFile?.name}`}</p>
            {keystore && (
              <>
                <div className={styles.amountInputWrapper}>
                  <input
                    value={password}
                    type="password"
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    placeholder="Password"
                    className={styles.amountInput}
                  />
                </div>
                <PrimaryButton onClick={importKeystoreFileHandler} isLoading={isUnlockingKeystore}>
                  Unlock
                </PrimaryButton>
                {isUnlockingKeystore && (
                  <div className={styles.waitingDecryptBlock}>
                    Waiting for your wallet to decrypt
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
