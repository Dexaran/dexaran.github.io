/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Address, useBalance, useContractRead } from "wagmi";
import { Icons } from "@/components/atoms/Icons";
import styles from "./AddressBalance.module.scss";
import stylesTokenCard from "./TokenCard.module.scss";
import stylesTokenCardMobile from "./TokenCardMobile.module.scss";
import { Token } from "@/components/SelectTokent/SelectTokent";
import { renderShortAddress } from "@/utils/renderAddress";
import { getConverterContract, getNetworkExplorerTokenUrl } from "@/utils/networks";
import clsx from "clsx";
import TokenConverterABI from "../../constants/abi/tokenConverter.json";
import { basePath } from "@/constants/build-config/isProd";

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
  const tokenAddressERC20 = token.contract;

  const { data: tokenBalanceERC20, isLoading: isERC20Loading } = useBalance({
    address: tokenAddressERC20 ? address : (undefined as any),
    token: tokenAddressERC20,
  });

  const { data: tokenAddressERC223Data } = useContractRead({
    address: getConverterContract(chainId),
    abi: TokenConverterABI,
    functionName: "getWrapperFor",
    args: [tokenAddressERC20],
  });
  const tokenAddressERC223: Address =
    tokenAddressERC223Data?.[0] === "0x0000000000000000000000000000000000000000"
      ? undefined
      : tokenAddressERC223Data?.[0];

  const { data: tokenBalanceERC223, isLoading: isERC223Loading } = useBalance({
    address: tokenAddressERC223 ? address : (undefined as any),
    token: tokenAddressERC223,
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
                : `${tokenBalanceERC20?.formatted || 0} ${token.symbol}`}
            </span>
          </div>
          <span
            className={clsx(
              stylesTokenCardMobile.tokenCardBalanceContract,
              stylesTokenCardMobile.withBorder,
            )}
          >
            <a
              target="_blank"
              rel="noreferrer"
              href={getNetworkExplorerTokenUrl(chainId, token.contract)}
            >{`${renderShortAddress(token.contract, 13)}`}</a>

            <Icons
              name="copy"
              onClick={async () => {
                await navigator.clipboard.writeText(token.contract);
                showMessage("ERC-20 Token address copied");
              }}
            />
          </span>
        </div>
        <div className={stylesTokenCardMobile.tokenCardBalance}>
          <div className={stylesTokenCardMobile.tokenCardBalanceAmount}>
            <span>ERC20</span>

            <span>
              {isERC223Loading
                ? "Loading.."
                : `${tokenBalanceERC223?.formatted || 0} ${token.symbol}`}
            </span>
          </div>
          <span className={stylesTokenCardMobile.tokenCardBalanceContract}>
            {tokenAddressERC223 &&
            tokenAddressERC223 !== "0x0000000000000000000000000000000000000000" ? (
              <>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={getNetworkExplorerTokenUrl(chainId, tokenAddressERC223 as string)}
                >{`${renderShortAddress(tokenAddressERC223 as string, 13)}`}</a>
                <Icons
                  name="copy"
                  onClick={async () => {
                    await navigator.clipboard.writeText(tokenAddressERC223 as string);
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
          {isERC20Loading ? "Loading.." : `${tokenBalanceERC20?.formatted || 0} ${token.symbol}`}
        </span>
        <span className={stylesTokenCard.tokenCardBalanceContract}>
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
      <div className={stylesTokenCard.tokenCardBalance}>
        <span>
          {isERC223Loading ? "Loading.." : `${tokenBalanceERC223?.formatted || 0} ${token.symbol}`}
        </span>
        <span className={stylesTokenCard.tokenCardBalanceContract}>
          {tokenAddressERC223 &&
          tokenAddressERC223 !== "0x0000000000000000000000000000000000000000" ? (
            <>
              <a
                target="_blank"
                rel="noreferrer"
                href={getNetworkExplorerTokenUrl(chainId, tokenAddressERC223 as string)}
              >{`${renderShortAddress(tokenAddressERC223 as string)}`}</a>
              <Icons
                name="copy"
                onClick={async () => {
                  await navigator.clipboard.writeText(tokenAddressERC223 as string);
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
