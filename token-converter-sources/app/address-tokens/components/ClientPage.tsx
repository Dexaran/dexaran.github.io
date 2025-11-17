"use client";
import { flip } from "@floating-ui/core";
import {
  autoUpdate,
  FloatingFocusManager,
  offset,
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Address, isAddress } from "viem";
import { useAccount } from "wagmi";

import TokenRow from "@/app/address-tokens/components/TokenRow";
import { useSearchTokensStore } from "@/app/address-tokens/hooks/useSearchTokensStore";
import Input, { InputSize } from "@/components/atoms/Input";
import ScrollbarContainer from "@/components/atoms/ScrollbarContainer";
import TextField, { InputLabel } from "@/components/atoms/TextField";
import { filterTokens } from "@/components/organisms/PickTokenDialog";
import { basePath } from "@/config/build/paths";
import useDerivedTokenInfo from "@/hooks/useDerivedTokenInfo";
import useTokens from "@/hooks/useTokens";
import { TwoStandardToken } from "@/types/Token";
import addToast from "@/utils/addToast";

function AutoCompleteButton({ token, onClick }: { token: TwoStandardToken; onClick: () => void }) {
  return (
    <button
      className="flex gap-2 bg-tertiary-bg hover:bg-quaternary-bg duration-200 py-3 px-5 w-full"
      key={token.address0}
      onClick={onClick}
    >
      <img src={token.logoURI} className="w-6 h-6" alt="" />
      {token.symbol}
    </button>
  );
}

export default function ClientAddressPage() {
  const [walletValue, setWalletValue] = useState("");
  const [addressToSearch, setAddressToSearch] = useState("");
  const { address } = useAccount();
  const { searchTokens, addToken, removeToken } = useSearchTokensStore();
  const parentRef = useRef(null);

  const tokens = useTokens();

  const virtualizer = useVirtualizer({
    count: searchTokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  const items = virtualizer.getVirtualItems();

  const minYPadding = useMemo(() => (tokens?.length ? 8 : 0), [tokens]);

  const [paddingTop, paddingBottom] = useMemo(() => {
    return items.length > 0
      ? [
          Math.max(minYPadding, items[0].start),
          Math.max(8, virtualizer.getTotalSize() - items[items.length - 1].end),
        ]
      : [minYPadding, 8];
  }, [items, minYPadding, virtualizer]);

  const tokenFromList = useMemo(() => {
    if (!addressToSearch || !tokens) {
      return undefined;
    }

    return tokens.find(
      (t) =>
        t.address0.toLowerCase() === addressToSearch.toLowerCase() ||
        t.address1.toLowerCase() === addressToSearch.toLowerCase(),
    );
  }, [tokens, addressToSearch]);

  const { isLoading, token: derivedToken } = useDerivedTokenInfo({
    tokenAddressToImport: addressToSearch as Address,
    enabled: !!addressToSearch && isAddress(addressToSearch) && !tokenFromList,
  });

  const [filteredTokens, isTokenFilterActive] = useMemo(() => {
    return addressToSearch ? [filterTokens(addressToSearch, tokens), true] : [tokens, false];
  }, [tokens, addressToSearch]);

  const handleAdd = useCallback(
    (token: TwoStandardToken) => {
      addToken(token);
      addToast(`Token ${token.symbol} added to search list!`);
      setIsOpenedPopover(false);
    },
    [addToken],
  );

  const renderPopoverContent = useCallback(() => {
    if (!addressToSearch) {
      return (
        <div className="bg-tertiary-bg max-h-[220px] w-full overflow-auto rounded-2">
          {tokens.slice(0, 20).map((t) => (
            <AutoCompleteButton
              key={t.address0}
              onClick={() => {
                handleAdd(t);
              }}
              token={t}
            />
          ))}
        </div>
      );
    }

    if (filteredTokens.length) {
      return (
        <div className="bg-tertiary-bg max-h-[220px] w-full overflow-auto rounded-2">
          {filteredTokens.slice(0, 20).map((t) => (
            <AutoCompleteButton
              key={t.address0}
              onClick={() => {
                handleAdd(t);
              }}
              token={t}
            />
          ))}
        </div>
      );
    }

    if (isAddress(addressToSearch) && !tokenFromList && isLoading) {
      return (
        <div className="bg-tertiary-bg h-12 w-full overflow-auto rounded-2 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      );
    }

    if (isAddress(addressToSearch) && !tokenFromList && derivedToken) {
      return (
        <div className="bg-tertiary-bg max-h-[220px] w-full overflow-auto rounded-2">
          <AutoCompleteButton
            onClick={() => {
              handleAdd(derivedToken);
            }}
            token={derivedToken}
          />
        </div>
      );
    }

    if (!filteredTokens.length && !derivedToken) {
      return (
        <div className="bg-tertiary-bg h-[220px] w-full overflow-auto rounded-2">
          Token not found
        </div>
      );
    }

    return null;
  }, [addressToSearch, derivedToken, filteredTokens, handleAdd, isLoading, tokenFromList, tokens]);

  const [isOpenedPopover, setIsOpenedPopover] = useState(false);

  console.log(isOpenedPopover);

  const ref = useRef<HTMLInputElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    elements: {
      reference: ref.current,
    },
    middleware: [offset(12), flip()],
    whileElementsMounted: autoUpdate,
    open: isOpenedPopover,
    onOpenChange: setIsOpenedPopover,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([focus, dismiss, role]);

  const [userChangedWalletAddress, setUserChangedWalletAddress] = useState<boolean>(false);

  useEffect(() => {
    if (!userChangedWalletAddress && address) {
      setWalletValue(address);
    }
  }, [address, userChangedWalletAddress]);

  return (
    <div className="max-w-[680px] mx-auto flex-grow">
      <h1 className="gap-1 text-28 md:text-40 font-medium mb-2 mt-6 md:mt-10 text-center">
        View address tokens
      </h1>
      <p className="text-secondary-text text-center mb-4 md:mb-8 px-4">
        You can view ERC-20 and ERC-223 token balances for any address here. Each ERC-20 token has
        an ERC-223 version. Pin tokens to display them at the top or add tokens by entering their
        name or address and clicking the + button. Use the load button to manage balances, with
        tokens from the top of the list loaded first. Balances are fetched directly from token
        contracts.
      </p>

      <div className="card-spacing-x card-spacing-y rounded-5 bg-primary-bg flex flex-col gap-5">
        <div className={clsx("bg-tertiary-bg rounded-3 px-4 md:px-5 py-3")}>
          <TextField
            inputSize={InputSize.DEFAULT}
            value={walletValue}
            onChange={(e) => {
              setUserChangedWalletAddress(true);
              setWalletValue(e.target.value);
            }}
            label="Wallet address"
            placeholder="0x..."
            tooltipText={
              "Enter the wallet address whose token balances you want to view. All tokens added below will show balances for this wallet, fetched directly from the blockchain in real time."
            }
          />
          <InputLabel
            tooltipText="Search for a token by its name or contract address.
You’ll see autocomplete suggestions from known tokens or live blockchain search results — click any item to add it to the list below and start tracking its balance."
            label="Token name or address"
          />

          <div>
            <div className="relative w-full">
              {/* Trigger Button */}
              <Input
                {...getReferenceProps()}
                ref={refs.setReference}
                onFocus={() => setIsOpenedPopover(true)}
                value={addressToSearch}
                placeholder="0x..."
                onChange={(e) => {
                  setAddressToSearch(e.target.value);
                }}
              />

              {/* Options Container */}
              {isOpenedPopover && (
                <FloatingFocusManager
                  context={context}
                  modal={false}
                  initialFocus={-1}
                  returnFocus={false}
                >
                  <div
                    ref={refs.setFloating}
                    style={{
                      ...floatingStyles,
                      width: ref.current?.offsetWidth,
                    }}
                    className={clsx("absolute z-20 w-full shadow-[0px_0px_40px_0px_#000000B2]")}
                    {...getFloatingProps()}
                  >
                    {renderPopoverContent()}
                  </div>
                </FloatingFocusManager>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="text-20 font-medium">List of tokens</p>

          {searchTokens.length ? (
            <>
              <div className="max-md:hidden grid grid-cols-[144fr_168fr_168fr_48fr] rounded-t-3 bg-quaternary-bg py-4 px-4 ">
                <span>Token</span>
                <span>ERC-20</span>
                <span>ERC-223</span>
                <span className="text-right">Remove</span>
              </div>

              <ScrollbarContainer
                scrollableNodeProps={{
                  ref: parentRef,
                }}
                height="full"
              >
                <div
                  className={clsx(
                    "flex flex-col gap-3 pl-5 pr-5 pt-5 bg-tertiary-bg max-md:rounded-4 md:rounded-b-4",
                  )}
                  style={{
                    paddingTop,
                    paddingBottom,
                  }}
                >
                  {items.map((item) => {
                    const token = searchTokens[item.index];
                    return (
                      <TokenRow
                        accountAddress={walletValue}
                        key={token.address0}
                        token={token}
                        onDelete={() => removeToken(token.address0)}
                      />
                    );
                  })}
                </div>
              </ScrollbarContainer>
            </>
          ) : (
            <div className="rounded-3 flex h-[180px] md:h-[340px] items-center justify-center bg-tertiary-bg relative">
              <span className="relative z-10">Added tokens will appear here</span>
              <img
                src={`${basePath}/empty-tokens.svg`}
                className="w-[180px] h-[180px] absolute right-0 top-0"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
