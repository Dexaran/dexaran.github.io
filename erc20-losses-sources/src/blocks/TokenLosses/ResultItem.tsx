import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { numericFormatter } from "react-number-format";

import { Collapse } from "@/components/atoms/Collapse";
import Svg from "@/components/atoms/Svg";
import { ToolTip } from "@/components/atoms/Tooltip/Tooltip";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { getTokenName } from "@/utils/calculations.util";
import { getNetworkExplorerAddressUrl } from "@/utils/networks";
import { renderShortAddress } from "@/utils/renderAddress";

const ItemContract = ({
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
        "flex justify-between text-16 font-semibold text-primary-text px-4 py-2",
        "even:bg-tertiary-bg rounded-2",
        "[&>*:nth-child(1)]:w-[50%] [&>*:nth-child(2)]:w-[60%] [&>*:nth-child(3)]:w-[40%] [&>*:nth-child(4)]:w-[40%] [&>*:nth-child(4)]:text-right",
        exclude && "text-secondary-text",
      )}
    >
      <p className="text-nowrap overflow-hidden text-ellipsis">{contractName || "—"}</p>
      <div
        className={clsx(
          "flex items-center gap-2 text-primary-text",
          exclude && "text-secondary-text",
        )}
      >
        {exclude && <Svg iconName="warning" />}
        <a
          className={clsx("font-normal font-mono", exclude && "text-secondary-text")}
          target="_blank"
          rel="noopener noreferrer"
          href={getNetworkExplorerAddressUrl(1, contract)}
        >
          {`${renderShortAddress(contract, 5)}`}
        </a>
        <Svg
          className="hover:text-main-primary cursor-pointer"
          iconName="copy"
          onClick={async () => {
            await navigator.clipboard.writeText(contract);
            showMessage("ERC-223 Token address copied");
          }}
        />
      </div>

      <p>
        {numericFormatter(`${roundedAmount}.00`, {
          decimalSeparator: ".",
          thousandSeparator: ",",
          decimalScale: 2,
          suffix: ` ${ticker} `,
        })}
      </p>
      <p className={clsx("flex justify-end items-center gap-1")}>
        {numericFormatter(`${dollarValue}`, {
          decimalSeparator: ".",
          thousandSeparator: ",",
          decimalScale: 2,
          prefix: `$`,
        })}
        {exclude && (
          <ToolTip text="Stuck tokens are found in the examined contract address but it is known that in this particular case their presence is intentional. Therefore they are not lost due to ERC-20 transferring flaw and were excluded from the calculation of losses." />
        )}
      </p>
    </div>
  );
};

export const ResultItem = ({ item, index }: { item: any; index: number }) => {
  const [isOpen, setIsOpen] = useState(false); // index < 3
  const [isDetailsShow, setDetailsShow] = useState(false);

  return (
    <div
      className="flex flex-col bg-secondary-bg px-5 rounded-3"
      style={{
        boxShadow: "inset 0px 4px 20px #505462",
      }}
    >
      <div className="min-h-[10px]" />
      <div className="flex justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2 text-primary-text text-18 font-semibold">
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
        <div className="flex items-center gap-4">
          <p className="text-18 font-semibold">
            <span className="text-secondary-text">Total losses:</span>
            {` ${numericFormatter(`${(item as any).amount}`, {
              decimalSeparator: ".",
              thousandSeparator: ",",
              decimalScale: 0,
              suffix: ` ${item.ticker} `,
            })}`}
            <span className="text-main-red">{`(${numericFormatter(`${item.asDollar}`, {
              decimalSeparator: ".",
              thousandSeparator: ",",
              decimalScale: 2,
              prefix: `$`,
            })})`}</span>
          </p>
          <Svg
            iconName="chevron-down"
            size={24}
            className={clsx("duration-200", isOpen && "rotate-180")}
          />
        </div>
      </div>

      <Collapse open={isOpen} style={{ width: "100%" }}>
        <div
          className={clsx(
            "flex justify-between border-t border-border-secondary mt-[10px] pt-3 pb-[10px] text-16 font-semibold text-secondary-text px-4",
            "[&>*:nth-child(1)]:w-[50%] [&>*:nth-child(2)]:w-[60%] [&>*:nth-child(3)]:w-[40%] [&>*:nth-child(4)]:w-[40%] [&>*:nth-child(4)]:text-right",
          )}
        >
          <p>Name</p>
          <p>Contract</p>
          <p>{`Losses, ${item.ticker}`}</p>
          <p>Losses, $</p>
        </div>
        {item.records.slice(0, 3).map((record) => {
          return (
            <ItemContract
              key={record.contract}
              contract={record.contract}
              dollarValue={record.dollarValue}
              roundedAmount={record.roundedAmount}
              ticker={item.ticker}
              exclude={record.exclude}
            />
          );
        })}
        <Collapse open={isDetailsShow} style={{ width: "100%" }}>
          {item.records.slice(3, item.records.length).map((record) => {
            return (
              <ItemContract
                key={record.contract}
                contract={record.contract}
                dollarValue={record.dollarValue}
                roundedAmount={record.roundedAmount}
                ticker={item.ticker}
                exclude={record.exclude}
              />
            );
          })}
        </Collapse>
        {item.records.length > 3 && (
          <button
            className="w-full bg-transparent flex justify-center items-center gap-2 px-4 py-5 text-main-primary text-16 font-semibold hover:text-main-primary-hover"
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
      <div className="min-h-[10px]" />
    </div>
  );
};
