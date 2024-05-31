import React from "react";
import styles from "./ConvertButton.module.scss";
import { PrimaryButton } from "../atoms/Button/Button";
import Modal from "../atoms/Modal";
import { Icons } from "../atoms/Icons";
import { renderShortAddress, renderShortHash } from "@/utils/renderAddress";
import { useNetwork } from "wagmi";
import { getNetworkExplorerTokenUrl, getNetworkExplorerTxUrl } from "@/utils/networks";

export default function TxModal({
  isOpen,
  handleClose,
  toERC223,
  txHash,
  contractAddress,
  status,
  error,
  isAddressLoading,
}: {
  isOpen: boolean;
  handleClose: any;
  status?: "error" | "success";
  toERC223: boolean;
  txHash?: string;
  contractAddress?: string;
  error?: any;
  isAddressLoading: boolean;
}) {
  const { chain } = useNetwork();

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} large>
      <div className={styles.txModalContainer}>
        {status === "error" ? (
          <>
            <Icons name="report" size="120px" />
            <p className={styles.txModalTitle}>An error occurred while converting</p>
            <p className={styles.txModalDescription}>Try to convert tokens later.</p>
            {error?.message ? (
              <p className={styles.txModalDescription}>{`Error: ${error.message}`}</p>
            ) : null}
            <div className={styles.txModalTx}>
              <p>Transaction</p>
              <a target="_blank" rel="noreferrer" href={getNetworkExplorerTxUrl(chain?.id, txHash)}>
                {renderShortHash(txHash, 10)}
              </a>
            </div>
            <div className={styles.txModalContract}>
              <p>{`${toERC223 ? "ERC-223" : "ERC-20"} token contract`}</p>
              <a
                target="_blank"
                rel="noreferrer"
                href={getNetworkExplorerTokenUrl(chain?.id, contractAddress)}
              >
                {renderShortAddress(contractAddress, 10)}
              </a>
            </div>
            <PrimaryButton onClick={handleClose} style={{ marginTop: "20px" }}>
              Done
            </PrimaryButton>
          </>
        ) : (
          <>
            <Icons name="success" size="120px" />
            <p className={styles.txModalTitle}>{`Tokens successfully converted to ${
              toERC223 ? "ERC-223" : "ERC-20"
            }`}</p>
            <p className={styles.txModalDescription}>Tokens are delivered to your address.</p>
            <div className={styles.txModalTx}>
              <p>Transaction</p>
              <a target="_blank" rel="noreferrer" href={getNetworkExplorerTxUrl(chain?.id, txHash)}>
                {renderShortHash(txHash, 10)}
              </a>
            </div>
            <div className={styles.txModalContract}>
              <p>{`${toERC223 ? "ERC-223" : "ERC-20"} token contract`}</p>
              {isAddressLoading || !contractAddress ? (
                <span>{isAddressLoading ? "Loading. ." : "Loading..."}</span>
              ) : (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={getNetworkExplorerTokenUrl(chain?.id, contractAddress)}
                >
                  {renderShortAddress(contractAddress, 10)}
                </a>
              )}
            </div>
            <PrimaryButton onClick={handleClose} style={{ marginTop: "20px" }}>
              Done
            </PrimaryButton>
          </>
        )}
      </div>
    </Modal>
  );
}
