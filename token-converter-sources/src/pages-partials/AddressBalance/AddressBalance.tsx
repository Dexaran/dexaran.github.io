import React from "react";
import homeStyles from "../../styles/Home.module.scss";
import { Address, useAccount, useBalance, useContractRead, useNetwork } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { Icons } from "@/components/atoms/Icons";
import styles from "./AddressBalance.module.scss";
import { List, AutoSizer } from "react-virtualized";
import { Token, loadChainTokens } from "@/components/SelectTokent/SelectTokent";
import { renderShortAddress } from "@/utils/renderAddress";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { getConverterContract, getNetworkExplorerTokenUrl } from "@/utils/networks";
import clsx from "clsx";
import TokenConverterABI from "../../constants/abi/tokenConverter.json";

const listHeight = 380;
const rowHeight = 100;

const TokenCard = ({
  address,
  token,
  showMessage,
  chainId,
}: {
  address: Address;
  token: Token;
  showMessage: (message: string) => void;
  chainId: number;
}) => {
  const tokenAddressERC20 = token.contract;
  const { data: tokenAddressERC223 } = useContractRead({
    address: getConverterContract(chainId),
    abi: TokenConverterABI,
    functionName: "getWrapperFor",
    args: [tokenAddressERC20],
  });

  const { data: tokenBalanceERC20, isLoading: isERC20Loading } = useBalance({
    address,
    token: tokenAddressERC20,
  });
  console.log("🚀 ~ isERC20Loading:", isERC20Loading)

  const { data: tokenBalanceERC223 } = useBalance({
    address,
    token: tokenAddressERC223 as any,
  });

  return (
    <div className={styles.tokenCard}>
      <div className={styles.tokenCardToken}>
        <Icons name="drag" fill="#787B78" size={20} />
        <img src={token.logo} width="44px" height="44px" alt={token.symbol} />
        <span>{token.symbol}</span>
      </div>
      <div className={styles.tokenCardBalance}>
        <span>
          {isERC20Loading ? "Loading.." : `${tokenBalanceERC20?.formatted || 0} ${token.symbol}`}
        </span>
        <span className={styles.tokenCardBalanceContract}>
          <a
            target="_blank"
            rel="noreferrer"
            href={getNetworkExplorerTokenUrl(chainId, token.contract)}
          >{`${renderShortAddress(token.contract)}`}</a>

          <Icons
            name="copy"
            onClick={async () => {
              await navigator.clipboard.writeText(token.contract);
              showMessage("ERC-20 Token address copied");
            }}
          />
        </span>
      </div>
      <div className={styles.tokenCardBalance}>
        <span>{`${0} ${token.symbol}`}</span>
        {/* <span>{renderShortAddress(token.contract)}</span> */}
        <span>—</span>
      </div>
      <button className={clsx(styles.updateButton, styles.actionButton)}>
        <Icons name="add" />
      </button>
    </div>
  );
};

export const AddressBalance = ({ defaultChainId }: { defaultChainId: number }) => {
  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenNameOrAddress, setTokenNameOrAddress] = useState("");
  const [chainTokens, setChainTokens] = useState([] as Token[]);

  useEffect(() => {
    setWalletAddress(address || "");
  }, [address, setWalletAddress]);

  useEffect(() => {
    (async () => {
      const tokens = await loadChainTokens(chain?.id || defaultChainId);
      setChainTokens(tokens || []);
    })();
  }, [chain?.id, defaultChainId]);

  const { showMessage } = useSnackbar();

  const renderRow = ({ index, key, style }) => {
    const token = chainTokens[index];
  
    return (
      <div className={styles.listItem} key={key} style={style}>
        <TokenCard
          token={token}
          showMessage={showMessage}
          chainId={chain?.id}
          address={walletAddress as any}
        />
      </div>
    );
  };

  return (
    <>
      <div className={homeStyles.contentBlockHeader}>
        <h1 className={homeStyles.h1}>View address tokens</h1>
        <p className={homeStyles.description}>
          {`Here, you have the power to explore tokens for any address you desire. But that's not all — we give you the freedom to curate your own list of favorite tokens for easy tracking. Discover, customize, and stay in control.`}
        </p>
      </div>
      <div className={styles.addTokens}>
        <div className={styles.converterFieldsLabel}>Wallet address</div>
        <div className={styles.amountInputWrapper}>
          <input
            value={walletAddress}
            onChange={(e) => {
              setWalletAddress(e.target.value);
            }}
            placeholder="Wallet address"
            className={styles.input}
            type="text"
          />
        </div>
        <div className={styles.converterFieldsLabel}>Token name or address</div>
        <div className={styles.addTokenContainer}>
          <div className={styles.amountInputWrapper}>
            <input
              value={tokenNameOrAddress}
              onChange={(e) => {
                setTokenNameOrAddress(e.target.value);
              }}
              placeholder="Token name or address"
              className={styles.input}
              type="text"
            />
          </div>
          <button className={styles.addTokenButton}>
            <Icons name="add" />
          </button>
        </div>
      </div>
      <div className={styles.tokensList}>
        <div className={styles.tokensListHeader}>
          <h3>List of tokens</h3>
          <button className={styles.updateButton}>
            <Icons name="update" />
          </button>
        </div>
        <div className={styles.tokensListTableHeader}>
          <span className={styles.tableToken}>Token</span>
          <span className={styles.tableERC20}>ERC-20</span>
          <span className={styles.tableERC223}>ERC-223</span>
          <span className={styles.tableAction}>Action</span>
        </div>
      </div>
      <AutoSizer disableHeight>
        {({ width }) => {
          return (
            <List
              width={width - 2}
              height={listHeight}
              rowHeight={rowHeight}
              rowRenderer={renderRow}
              rowCount={chainTokens.length}
              overscanRowCount={3}
              className={styles.list}
              style={{
                paddingBottom: "20px",
              }}
            />
          );
        }}
      </AutoSizer>
    </>
  );
};
