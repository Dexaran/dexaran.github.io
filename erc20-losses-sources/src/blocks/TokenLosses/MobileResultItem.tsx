import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { numericFormatter } from "react-number-format";

import { Collapse } from "@/components/atoms/Collapse";
import Svg from "@/components/atoms/Svg";
import { MobileToolTip } from "@/components/atoms/Tooltip/Tooltip";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { getTokenName } from "@/utils/calculations.util";
import { getNetworkExplorerAddressUrl } from "@/utils/networks";
import { renderShortAddress } from "@/utils/renderAddress";

const ItemContractMobile = ({
  contract,
  roundedAmount,
  ticker,
  dollarValue,
  exclude,
}: {
  contract: string;
  roundedAmount: any;
  ticker: string;
  dollarValue: any;
  exclude: boolean;
}) => {
  const { showMessage } = useSnackbar();
  const [contractName, setContractName] = useState();
  useEffect(() => {
    (async () => {
      const name = await getTokenName(contract);
      setContractName(name);
    })();
  }, [contract]);

  return (
    <div
      key={contract}
      className={clsx(
        "flex flex-col py-3 px-4 bg-tertiary-bg rounded-2 text-14 font-semibold",
        "[&>div]:flex [&>div]:justify-between [&>div]:items-center [&>div]:py-1 [&>div>p:nth-child(1)]:text-secondary-text",
        "[&>p]:text-nowrap [&>p]:overflow-hidden [&>p]:text-ellipsis",
        exclude && "text-secondary-text",
      )}
    >
      <div>
        <p>Name</p>
        <p>{contractName}</p>
      </div>
      <div>
        <p>Contract</p>
        <p className="flex items-center gap-2">
          <a
            className={clsx("font-normal font-mono", exclude && "text-secondary-text")}
            target="_blank"
            rel="noopener noreferrer"
            href={getNetworkExplorerAddressUrl(1, contract)}
          >{`${renderShortAddress(contract, 4)}`}</a>
          <Svg
            className="hover:text-main-primary cursor-pointer"
            iconName="copy"
            onClick={async () => {
              await navigator.clipboard.writeText(contract);
              showMessage("ERC-223 Token address copied");
            }}
          />
        </p>
      </div>
      <div>
        <p>{`Losses, ${ticker}`}</p>
        <p>
          {numericFormatter(`${roundedAmount}.00`, {
            decimalSeparator: ".",
            thousandSeparator: ",",
            decimalScale: 2,
            suffix: ` ${ticker} `,
          })}
        </p>
      </div>
      <div>
        <p>Losses, $</p>
        <p className={clsx(exclude && "flex gap-1 items-center")}>
          {numericFormatter(`${dollarValue}`, {
            decimalSeparator: ".",
            thousandSeparator: ",",
            decimalScale: 2,
            prefix: `$`,
          })}
          {exclude && (
            <MobileToolTip>{`Stuck tokens are found in the examined contract address but it is known that in this particular case their presence is intentional. Therefore they are not lost due to ERC-20 transferring flaw and were excluded from the calculation of losses.`}</MobileToolTip>
          )}
        </p>
      </div>
    </div>
  );
};

export const MobileResultItem = ({ item, index }: { item: any; index: number }) => {
  const [isOpen, setIsOpen] = useState(false); // index < 3
  const [isDetailsShow, setDetailsShow] = useState(false);

  return (
    <div
      className="flex flex-col bg-secondary-bg px-5 rounded-3"
      style={{
        boxShadow: "inset 0px 4px 20px #505462",
      }}
    >
      <div className="min-h-[16px]" />
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-primary-text text-[18px] leading-[32px] font-semibold py-1">
          {item.logo ? <img src={item.logo} width="32px" height="32px" alt={item.ticker} /> : null}
          {item.ticker}
          <a
            className="text-primary-text hover:text-green"
            target="_blank"
            rel="noopener noreferrer"
            href={getNetworkExplorerAddressUrl(1, item.tokenAddress)}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Svg iconName="forward" />
          </a>
        </div>
        <Svg
          iconName="chevron-down"
          size={24}
          className={clsx("duration-200", isOpen && "rotate-180")}
        />
      </div>
      <p className="text-[16px] leading-[24px] font-semibold pt-1">
        <span className="text-secondary-text">Total losses:</span>
        {` ${numericFormatter(`${(item as any).amount}`, {
          decimalSeparator: ".",
          thousandSeparator: ",",
          decimalScale: 0,
          suffix: ` ${item.ticker} `,
        })}`}
        <span className="text-red">{`(${numericFormatter(`${item.asDollar}`, {
          decimalSeparator: ".",
          thousandSeparator: ",",
          decimalScale: 2,
          prefix: `$`,
        })})`}</span>
      </p>

      <Collapse open={isOpen} style={{ width: "100%", marginTop: isOpen && "12px" }}>
        <div className="flex flex-col gap-2">
          {item.records.slice(0, 3).map((record) => {
            return (
              <ItemContractMobile
                key={record.contract}
                contract={record.contract}
                dollarValue={record.dollarValue}
                roundedAmount={record.roundedAmount}
                ticker={item.ticker}
                exclude={record.exclude}
              />
            );
          })}
        </div>
        <Collapse open={isDetailsShow} style={{ width: "100%" }}>
          <div className={clsx("flex flex-col gap-2", isDetailsShow && "mt-2")}>
            {item.records.slice(3, item.records.length).map((record) => {
              return (
                <ItemContractMobile
                  key={record.contract}
                  contract={record.contract}
                  dollarValue={record.dollarValue}
                  roundedAmount={record.roundedAmount}
                  ticker={item.ticker}
                  exclude={record.exclude}
                />
              );
            })}
          </div>
        </Collapse>
        {item.records.length > 3 && (
          <button
            className="w-full bg-transparent flex justify-center items-center gap-2 px-4 py-4 text-main-primary text-16 font-semibold hover:text-main-primary-hover"
            onClick={() => setDetailsShow(!isDetailsShow)}
          >
            {isDetailsShow ? "Less" : "More"}
            <Svg
              iconName="chevron-down"
              size={24}
              className={clsx("duration-200", isDetailsShow && "rotate-180")}
            />
          </button>
        )}
      </Collapse>
      <div className={clsx("min-h-[16px]", isOpen && "min-h-0")} />
    </div>
  );
};
