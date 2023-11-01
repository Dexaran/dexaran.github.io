import React from "react";
import styles from "../styles/Home.module.scss";
import { Address, useAccount, useBalance, useContractRead, useNetwork } from "wagmi";
import TokenConverterABI from "../constants/abi/tokenConverter.json";
import { useEffect, useMemo, useState } from "react";
import { Manrope } from "next/font/google";
import { useSwitchNetwork } from "wagmi";
import { Icons } from "@/components/atoms/Icons";
import ChangeNetwork from "@/components/ChangeNetwork/ChangeNetwork";
import SelectTokent from "@/components/SelectTokent/SelectTokent";
import { ConnectWallet } from "@/components/ConnectWallet/ConnectWallet";
import { DebugBlock } from "@/components/DebugBlock/DebugBlock";
import { PrimaryButton } from "@/components/atoms/Button/Button";
import { ConvertToERC223 } from "@/components/ConvertButton/ConvertToERC223";
import { ConvertToERC20 } from "@/components/ConvertButton/ConvertToERC20";
import { getConverterContract, supportedChainIds } from "@/utils/networks";

const ERC20_URL = "https://eips.ethereum.org/EIPS/eip-20";
const ERC223_URL = "https://eips.ethereum.org/EIPS/eip-223";

export const manrope = Manrope({ subsets: ["latin"] });

export const Converter = ({
  defaultChainId,
  setIsChangeNetworkOpen,
}: {
  defaultChainId: number;
  setIsChangeNetworkOpen: (isOpen: boolean) => void;
}) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [amountToConvert, setAmountToConvert] = useState("");
  const [toERC223, setToERC223] = useState(true);
  const [isCustomToken, setIsCustomToken] = useState(false);
  const [tokenAddressERC20, setTokenAddressERC20] = useState(undefined as Address | undefined);
  const [tokenAddressERC223, setTokenAddressERC223] = useState(undefined as Address | undefined);

  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();

  const isNetworkSupported = useMemo(() => {
    if (chain?.id && supportedChainIds.includes(chain.id)) {
      return true;
    }

    return false;
  }, [chain]);

  const { data: tokenBalanceERC20 } = useBalance({
    address: tokenAddressERC20 ? address : undefined as any,
    token: tokenAddressERC20,
    watch: true,
  });

  const { data: tokenBalanceERC223 } = useBalance({
    address: tokenAddressERC223 ? address : undefined as any,
    token: tokenAddressERC223,
    watch: true,
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <div className={styles.contentBlockHeader}>
        <h1 className={styles.h1}>
          {`ERC20 `}
          <div className={styles.arrows}>
            <span>{`<—>`}</span>
          </div>
          {`ERC223 Token Converter`}
        </h1>
        <p className={styles.description}>
          This is a token converter that converts ERC-20 tokens to ERC-223. It can also convert
          ERC-223 tokens back to ERC-20 at any time. No fees are charged. Read more about the
          conversion process <a href="#">here.</a>
        </p>
      </div>
      <div className={styles.converter}>
        <div className={styles.infoLabel}>
          <Icons name="info" />
          {toERC223 ? (
            <p>
              You are converting your{" "}
              <a target="_blank" href={ERC20_URL}>
                ERC-20
              </a>{" "}
              token to{" "}
              <a target="_blank" href={ERC223_URL}>
                ERC-223
              </a>{" "}
              token
            </p>
          ) : (
            <p>
              You are converting your{" "}
              <a target="_blank" href={ERC223_URL}>
                ERC-223
              </a>{" "}
              token to{" "}
              <a target="_blank" href={ERC20_URL}>
                ERC-20
              </a>{" "}
              token
            </p>
          )}
        </div>
        <div className={styles.fromLabel}>
          <span>From</span>
          <span>{toERC223 ? "ERC-20" : "ERC-223"}</span>
        </div>
        <div className={styles.switchButtonWrapper}>
          <button
            className={`${styles.switchButton} ${toERC223 ? "" : styles.rotated}`}
            onClick={() => setToERC223(!toERC223)}
            disabled={isCustomToken}
          >
            <Icons name="swap" fill="#FDFFFC" />
          </button>
        </div>
        <div className={styles.toLabel}>
          <span>To</span>
          <span>{toERC223 ? "ERC-223" : "ERC-20"}</span>
        </div>
        {isConnected && !isNetworkSupported && (
          <div className={styles.notSupported}>
            Converter for {chain?.name} is not supported yet
            <PrimaryButton onClick={() => setIsChangeNetworkOpen(true)}>
              Switch network
            </PrimaryButton>
          </div>
        )}
        {(isNetworkSupported || !isConnected) && (
          <div className={styles.converterFieldsWrapper}>
            <SelectTokent
              defaultChainId={defaultChainId}
              amountToConvert={amountToConvert}
              setAmountToConvert={setAmountToConvert}
              tokenAddressERC20={tokenAddressERC20}
              tokenAddressERC223={tokenAddressERC223}
              setTokenAddressERC20={setTokenAddressERC20}
              setTokenAddressERC223={setTokenAddressERC223}
              tokenBalanceERC20={tokenBalanceERC20}
              tokenBalanceERC223={tokenBalanceERC223}
              toERC223={toERC223}
              setToERC223={setToERC223}
              isCustomToken={isCustomToken}
              setIsCustomToken={setIsCustomToken}
            />
          </div>
        )}
        {isConnected && isNetworkSupported && (
          <>
            {toERC223 ? (
              <ConvertToERC223
                amountToConvert={amountToConvert}
                tokenAddressERC20={tokenAddressERC20}
                tokenAddressERC223={tokenAddressERC223}
                tokenBalanceERC20={tokenBalanceERC20}
              />
            ) : (
              <ConvertToERC20
                amountToConvert={amountToConvert}
                tokenAddressERC20={tokenAddressERC20}
                tokenAddressERC223={tokenAddressERC223}
                tokenBalanceERC223={tokenBalanceERC223}
              />
            )}
          </>
        )}
        {!isConnected && <ConnectWallet />}
      </div>
      {/* <DebugBlock /> */}
    </>
  );
};
