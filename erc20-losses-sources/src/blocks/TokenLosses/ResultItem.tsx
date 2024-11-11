import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { numericFormatter } from "react-number-format";

import { WhiteSecondaryButton } from "@/components/atoms/buttons/Button/Button";
import { Collapse } from "@/components/atoms/Collapse";
import { Icons } from "@/components/atoms/Icons";
import { ToolTip } from "@/components/atoms/Tooltip/Tooltip";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { getTokenName } from "@/utils/calculations.util";
import { getNetworkExplorerAddressUrl } from "@/utils/networks";
import { renderShortAddress } from "@/utils/renderAddress";

import styles from "./TokenLosses.module.scss";

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
    <div key={contract} className={clsx(styles.itemDetailsRow, exclude && styles.exclude)}>
      <p>{contractName || "—"}</p>
      <p className={styles.tokenCardBalanceContract}>
        {exclude && <Icons name="warning" />}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={getNetworkExplorerAddressUrl(1, contract)}
        >
          {`${renderShortAddress(contract, 13)}`}
        </a>
        <Icons
          name="copy"
          onClick={async () => {
            await navigator.clipboard.writeText(contract);
            showMessage("ERC-223 Token address copied");
          }}
        />{" "}
      </p>

      <p>
        {numericFormatter(`${roundedAmount}.00`, {
          decimalSeparator: ".",
          thousandSeparator: ",",
          decimalScale: 2,
          suffix: ` ${ticker} `,
        })}
      </p>
      <p>
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

// .resultItem {
//   padding: 12px 20px;
// }

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
      <div className={styles.resultItemHeader} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.resultItemHeaderName}>
          {item.logo ? <img src={item.logo} width="32px" height="32px" alt={item.ticker} /> : null}
          {item.ticker}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={getNetworkExplorerAddressUrl(1, item.tokenAddress)}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Icons name="openLink" />
          </a>
        </div>
        <div className={styles.resultItemHeaderLosses}>
          <p>
            {`Total losses: ${numericFormatter(`${(item as any).amount}`, {
              decimalSeparator: ".",
              thousandSeparator: ",",
              decimalScale: 0,
              suffix: ` ${item.ticker} `,
            })}`}
          </p>
          <span className={styles.resultItemHeaderLossesUsd}>{`(${numericFormatter(
            `${item.asDollar}`,
            {
              decimalSeparator: ".",
              thousandSeparator: ",",
              decimalScale: 2,
              prefix: `$`,
            },
          )})`}</span>
          <Icons name="chevronDown" className={clsx(styles.chevron, isOpen && styles.open)} />
        </div>
      </div>
      <Collapse open={isOpen} style={{ width: "100%" }}>
        <div className={styles.itemDetailsHeader}>
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
          <WhiteSecondaryButton onClick={() => setDetailsShow(!isDetailsShow)}>
            {isDetailsShow ? "Collapse details" : "Expand details"}
            <Icons
              name="chevronDown"
              className={clsx(styles.chevron, isDetailsShow && styles.open)}
            />
          </WhiteSecondaryButton>
        )}
      </Collapse>
      <div className="min-h-[10px]" />
    </div>
  );
};
