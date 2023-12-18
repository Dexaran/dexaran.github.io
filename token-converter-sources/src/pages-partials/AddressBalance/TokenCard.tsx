/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Address, useBalance, useContractRead } from "wagmi";
import { Icons } from "@/components/atoms/Icons";
import styles from "./AddressBalance.module.scss";
import stylesTokenCard from "./TokenCard.module.scss";
import stylesTokenCardMobile from "./TokenCardMobile.module.scss";
import { renderShortAddress, roundValue } from "@/utils/renderAddress";
import { getConverterContract, getNetworkExplorerTokenUrl } from "@/utils/networks";
import clsx from "clsx";
import TokenConverterABI from "../../constants/abi/tokenConverter.json";
import { basePath } from "@/constants/build-config/isProd";
import { Token } from "./token.type";

export const TokenCard = ({
  address,
  token,
  showMessage,
  chainId,
  isCustom,
  addHandler,
  removeHandler,
  isMobile,
}: {
  address: Address;
  token: Token;
  showMessage: (message: string) => void;
  chainId: number;
  isCustom: boolean;
  addHandler: (token: Token) => void;
  removeHandler: (token: Token) => void;
  isMobile: boolean;
}) => {
  const { data: tokenBalanceERC20, isLoading: isERC20Loading } = useBalance({
    address: token.tokenAddressERC20 ? address : (undefined as any),
    token: token.tokenAddressERC20,
  });

  const { data: tokenBalanceERC223, isLoading: isERC223Loading } = useBalance({
    address: token.tokenAddressERC223 ? address : (undefined as any),
    token: token.tokenAddressERC223,
    watch: true,
  });

  if (isMobile) {
    return (
      <div className={stylesTokenCardMobile.tokenCard}>
        <div className={stylesTokenCardMobile.tokenCardHeader}>
          <div
            className={clsx(
              stylesTokenCardMobile.tokenCardToken,
              isCustom && stylesTokenCardMobile.isCustom,
            )}
          >
            {isCustom ? <Icons name="drag" fill="#787B78" size={20} /> : null}
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
            {token.tokenAddressERC20 ? (
              <>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={getNetworkExplorerTokenUrl(chainId, token.tokenAddressERC20)}
                >{`${renderShortAddress(token.tokenAddressERC20, 13)}`}</a>

                <Icons
                  name="copy"
                  onClick={async () => {
                    await navigator.clipboard.writeText(token.tokenAddressERC20);
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
            {token.tokenAddressERC223 ? (
              <>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={getNetworkExplorerTokenUrl(chainId, token.tokenAddressERC223 as string)}
                >{`${renderShortAddress(token.tokenAddressERC223 as string, 13)}`}</a>
                <Icons
                  name="copy"
                  onClick={async () => {
                    await navigator.clipboard.writeText(token.tokenAddressERC223 as string);
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
      <div className={clsx(stylesTokenCard.tokenCardToken, isCustom && stylesTokenCard.isCustom)}>
        {isCustom ? <Icons name="drag" fill="#787B78" size={20} /> : null}
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
          {token.tokenAddressERC20 ? (
            <>
              <a
                target="_blank"
                rel="noreferrer"
                href={getNetworkExplorerTokenUrl(chainId, token.tokenAddressERC20 as string)}
              >{`${renderShortAddress(token.tokenAddressERC20 as string)}`}</a>
              <Icons
                name="copy"
                onClick={async () => {
                  await navigator.clipboard.writeText(token.tokenAddressERC20 as string);
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
          {token.tokenAddressERC223 ? (
            <>
              <a
                target="_blank"
                rel="noreferrer"
                href={getNetworkExplorerTokenUrl(chainId, token.tokenAddressERC223 as string)}
              >{`${renderShortAddress(token.tokenAddressERC223 as string)}`}</a>
              <Icons
                name="copy"
                onClick={async () => {
                  await navigator.clipboard.writeText(token.tokenAddressERC223 as string);
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
