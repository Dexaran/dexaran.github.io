import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { useMemo, useRef, useState } from "react";

import { basePath } from "@/config/build/paths";
import { Standard } from "@/config/standard.config";
import useTokens from "@/hooks/useTokens";
import { useConvertTokensStore } from "@/stores/useConvertTokenStore";
import { TwoStandardToken } from "@/types/Token";

import DialogHeader from "../atoms/DialogHeader";
import DrawerDialog from "../atoms/DrawerDialog";
import { SearchInput } from "../atoms/Input";
import ScrollbarContainer from "../atoms/ScrollbarContainer";
import SelectButton from "../atoms/SelectButton";
import Svg from "../atoms/Svg";

const generateOrderedSubsets = (arr: string[]): string[] => {
  const _arr: string[] = [];
  for (let start = 1; start < arr.length; start++) {
    let subset = "";
    for (let end = start; end < arr.length; end++) {
      subset = subset ? `${subset} ${arr[end]}` : arr[end];
      _arr.push(subset);
    }
  }
  return _arr;
};
export function filterTokens<T extends TwoStandardToken>(searchStr: string, tokens: T[]): T[] {
  return tokens.filter((token) => {
    // const nameParts = token.name ? token.name.split(" ") : [];
    const symbolParts = token.symbol ? token.symbol.split(" ") : [];
    const addressParts = [token.address0, token.address1];

    const allPartsArr = [...symbolParts, ...addressParts];
    // if (token.name && nameParts.length > 1) {
    //   allPartsArr.push(token.name);
    // }

    if (token.symbol && symbolParts.length > 1) {
      allPartsArr.push(token.symbol);
    }

    const allParts = Array.from(
      new Set<string>([
        ...allPartsArr,
        // ...generateOrderedSubsets(nameParts),
        ...generateOrderedSubsets(symbolParts),
      ]),
    );

    for (let i = 0; i < allParts.length; i++) {
      if (allParts[i].toLowerCase().startsWith(searchStr.toLowerCase())) {
        return true;
      }
    }
  });
}

function TokenRowSimple({
  currency,
  handlePick,
  isMobile,
  prevToken,
}: {
  currency: TwoStandardToken;
  handlePick: (currency: TwoStandardToken) => void;
  isMobile: boolean;
  prevToken?: TwoStandardToken;
}) {
  return (
    <div
      role="button"
      onClick={() => handlePick(currency)}
      className="rounded-2 flex items-center flex-wrap md:block md:rounded-0 pl-3 pr-1.5 md:pl-10 md:pr-7 bg-transparent hover:bg-tertiary-bg duration-200 group py-1 md:py-2 w-full text-left"
    >
      <div className="grid md:grid-cols-[40px_1fr] grid-cols-[32px_1fr] gap-2 w-full">
        <div className="flex items-center">
          <img
            src={
              currency?.logoURI !== "/tokens/placeholder.svg"
                ? currency?.logoURI || ""
                : `${basePath}/images/tokens/placeholder.svg`
            }
            alt=""
            className="w-8 h-8"
          />
        </div>
        <div className="w-full pl-1 md:pl-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center md:gap-x-2 flex-wrap">
              <div className="flex items-center w-[120px] md:gap-2 md:w-[256px]">
                <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">
                  {currency.symbol}
                </span>
              </div>

              <span className="w-full ">
                <span className="w-[300px] whitespace-nowrap overflow-hidden overflow-ellipsis block text-secondary-text text-12  md:text-14">
                  {currency.name}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="block w-10" />
              {prevToken && prevToken.symbol === currency.symbol && (
                <Svg iconName="check" className="text-green mr-1.5" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PickTokenDialog({
  onPick,
  disabled,
}: {
  onPick: () => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const parentRef = useRef(null);
  const tokens = useTokens();
  const { token, setToken, setTokenStandard } = useConvertTokensStore();

  const virtualizer = useVirtualizer({
    count: tokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });
  const items = virtualizer.getVirtualItems();

  const minYPadding = useMemo(() => (tokens?.length ? 8 : 0), [tokens]);
  const [tokensSearchValue, setTokensSearchValue] = useState("");

  const [paddingTop, paddingBottom] = useMemo(() => {
    return items.length > 0
      ? [
          Math.max(minYPadding, items[0].start),
          Math.max(8, virtualizer.getTotalSize() - items[items.length - 1].end),
        ]
      : [minYPadding, 8];
  }, [items, minYPadding, virtualizer]);

  const [filteredTokens, isTokenFilterActive] = useMemo(() => {
    return tokensSearchValue ? [filterTokens(tokensSearchValue, tokens), true] : [tokens, false];
  }, [tokens, tokensSearchValue]);
  //
  // const { token: derivedToken, isLoading } = useDerivedTokenInfo({
  //   tokenAddressToImport: tokensSearchValue as Address,
  //   enabled: !!tokensSearchValue && isAddress(tokensSearchValue) && filteredTokens.length === 0,
  // });

  return (
    <>
      <SelectButton
        fullWidth
        className="bg-quaternary-bg h-12 pl-5"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
      >
        {token ? (
          <span className="flex items-center gap-2">
            <img className="w-6 h-6 rounded-full" src={token.logoURI} alt="" />
            {token.symbol}
          </span>
        ) : (
          "Select token"
        )}
      </SelectButton>
      <DrawerDialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <DialogHeader onClose={() => setIsOpen(false)} title="Select token" />
        <div className="w-full sm:w-[600px] max-h-[580px] h-[calc(100vh_-_60px)] flex flex-col">
          <div className={clsx("card-spacing-x pb-3")}>
            <SearchInput
              value={tokensSearchValue}
              onChange={(e) => setTokensSearchValue(e.target.value)}
              placeholder="Search name or token contract"
            />
          </div>
          {Boolean(filteredTokens.length) && (
            <div className={"flex-grow flex min-h-0 overflow-hidden"}>
              <ScrollbarContainer
                scrollableNodeProps={{
                  ref: parentRef,
                }}
                height="full"
              >
                <div
                  className={clsx(
                    "flex flex-col gap-2 md:gap-0 md:pl-0 md:pr-[11px] pt-3 pl-2 pr-3",
                  )}
                  style={{
                    paddingTop,
                    paddingBottom,
                  }}
                >
                  {items.map((item) => {
                    const token = filteredTokens[item.index];
                    // if (simpleForm)
                    return (
                      <TokenRowSimple
                        handlePick={(token) => {
                          console.log(token);
                          onPick();
                          setToken(token);
                          if (token.isErc223Origin) {
                            setTokenStandard(Standard.ERC223);
                          }
                          setIsOpen(false);
                        }}
                        key={token.address0}
                        currency={token}
                        isMobile={false}
                      />
                    );
                  })}
                </div>
              </ScrollbarContainer>
            </div>
          )}
        </div>
      </DrawerDialog>
    </>
  );
}
