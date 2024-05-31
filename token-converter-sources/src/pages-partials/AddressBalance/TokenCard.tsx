/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Address, useBalance } from "wagmi";
import { Icons } from "@/components/atoms/Icons";
import styles from "./AddressBalance.module.scss";
import stylesTokenCard from "./TokenCard.module.scss";
import stylesTokenCardMobile from "./TokenCardMobile.module.scss";
import { renderShortAddress, roundValue } from "@/utils/renderAddress";
import { getNetworkExplorerTokenUrl } from "@/utils/networks";
import clsx from "clsx";
import { basePath } from "@/constants/build-config/isProd";
import { Token } from "./token.type";

export const TokenCard = ({
  walletAddress,
  token,
  showMessage,
  chainId,
  isCustom,
  addHandler,
  removeHandler,
  isMobile,
}: {
  walletAddress: Address;
  token: Token;
  showMessage: (message: string) => void;
  chainId: number;
  isCustom: boolean;
  addHandler: (token: Token) => void;
  removeHandler: (token: Token) => void;
  isMobile: boolean;
}) => {
  const address0 = token.tokenAddressERC20;
  const address1 = token.tokenAddressERC223;

  const { data: tokenBalanceERC20, isLoading: isERC20Loading } = useBalance({
    address: address0 ? walletAddress : undefined,
    token: address0,
  });

  const { data: tokenBalanceERC223, isLoading: isERC223Loading } = useBalance({
    address: address1 ? walletAddress : undefined,
    token: address1,
  });

  if (isMobile) {
    return (
      <div className={stylesTokenCardMobile.tokenCard}>
        <div className={stylesTokenCardMobile.tokenCardHeader}>
          <div className={clsx(stylesTokenCardMobile.tokenCardToken)}>
            <img
              src={token.logo || `${basePath}/token-default.svg`}
              width="44px"
              height="44px"
              alt={token.symbol}
            />
            <span>{token.symbol}</span>
          </div>

          <button
            className={clsx(styles.updateButton, styles.actionButton)}
            onClick={() => {
              if (isCustom) {
                removeHandler(token);
              } else {
                addHandler(token);
              }
            }}
          >
            <Icons name={isCustom ? "delete" : "add"} />
          </button>
        </div>
        <div className={stylesTokenCardMobile.tokenCardBalance}>
          <div className={stylesTokenCardMobile.tokenCardBalanceAmount}>
            <span>ERC20</span>
            <span>
              {isERC20Loading
                ? "Loading.."
                : `${roundValue(parseFloat(tokenBalanceERC20?.formatted || "0"))} ${token.symbol}`}
            </span>
          </div>
          <span
            className={clsx(
              stylesTokenCardMobile.tokenCardBalanceContract,
              stylesTokenCardMobile.withBorder,
            )}
          >
            {address0 ? (
              <>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={getNetworkExplorerTokenUrl(chainId, address0)}
                >{`${renderShortAddress(address0, 13)}`}</a>

                <Icons
                  name="copy"
                  onClick={async () => {
                    await navigator.clipboard.writeText(address0);
                    showMessage("ERC-20 Token address copied");
                  }}
                />
              </>
            ) : (
              "not deployed yet"
            )}
          </span>
        </div>
        <div className={stylesTokenCardMobile.tokenCardBalance}>
          <div className={stylesTokenCardMobile.tokenCardBalanceAmount}>
            <span>ERC223</span>

            <span>
              {isERC223Loading
                ? "Loading.."
                : `${roundValue(parseFloat(tokenBalanceERC223?.formatted || "0"))} ${token.symbol}`}
            </span>
          </div>
          <span className={stylesTokenCardMobile.tokenCardBalanceContract}>
            {address1 ? (
              <>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={getNetworkExplorerTokenUrl(chainId, address1 as string)}
                >{`${renderShortAddress(address1 as string, 13)}`}</a>
                <Icons
                  name="copy"
                  onClick={async () => {
                    await navigator.clipboard.writeText(address1 as string);
                    showMessage("ERC-223 Token address copied");
                  }}
                />
              </>
            ) : (
              "not deployed yet"
            )}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={stylesTokenCard.tokenCard}>
      <div className={clsx(stylesTokenCard.tokenCardToken)}>
        <img
          src={token.logo || `${basePath}/token-default.svg`}
          width="44px"
          height="44px"
          alt={token.symbol}
        />
        <span>{token.symbol}</span>
      </div>
      <div className={stylesTokenCard.tokenCardBalance}>
        <span>
          {isERC20Loading
            ? "Loading.."
            : `${roundValue(parseFloat(tokenBalanceERC20?.formatted || "0"))} ${token.symbol}`}
        </span>
        <span className={stylesTokenCard.tokenCardBalanceContract}>
          {address0 ? (
            <>
              <a
                target="_blank"
                rel="noreferrer"
                href={getNetworkExplorerTokenUrl(chainId, address0 as string)}
              >{`${renderShortAddress(address0 as string)}`}</a>
              <Icons
                name="copy"
                onClick={async () => {
                  await navigator.clipboard.writeText(address0 as string);
                  showMessage("ERC-20 Token address copied");
                }}
              />
            </>
          ) : (
            "not deployed yet"
          )}
        </span>
      </div>
      <div className={stylesTokenCard.tokenCardBalance}>
        <span>
          {isERC223Loading
            ? "Loading.."
            : `${roundValue(parseFloat(tokenBalanceERC223?.formatted || "0"))} ${token.symbol}`}
        </span>
        <span className={stylesTokenCard.tokenCardBalanceContract}>
          {address1 ? (
            <>
              <a
                target="_blank"
                rel="noreferrer"
                href={getNetworkExplorerTokenUrl(chainId, address1 as string)}
              >{`${renderShortAddress(address1 as string)}`}</a>
              <Icons
                name="copy"
                onClick={async () => {
                  await navigator.clipboard.writeText(address1 as string);
                  showMessage("ERC-223 Token address copied");
                }}
              />
            </>
          ) : (
            "not deployed yet"
          )}
        </span>
      </div>
      <button
        className={clsx(styles.updateButton, styles.actionButton)}
        onClick={() => {
          if (isCustom) {
            removeHandler(token);
          } else {
            addHandler(token);
          }
        }}
      >
        <Icons name={isCustom ? "delete" : "add"} />
      </button>
    </div>
  );
};
