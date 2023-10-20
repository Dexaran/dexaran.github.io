import React, { useState } from "react";
import { Icons } from "@/components/atoms/Icons";
import styles from "./TokenLosses.module.scss";
import clsx from "clsx";
import { numericFormatter } from "react-number-format";
import {
  WhiteSecondaryButton,
} from "@/components/atoms/Button/Button";
import Collapse from "@/components/atoms/Collapse";
import { getNetworkExplorerTokenUrl } from "@/utils/networks";
import { renderShortAddress } from "@/utils/renderAddress";
import { useSnackbar } from "@/providers/SnackbarProvider";

export const MobileResultItem = ({ item, index }: { item: any; index: number }) => {
  const [isOpen, setIsOpen] = useState(false); // index < 3
  const [isDetailsShow, setDetailsShow] = useState(false);
  const { showMessage } = useSnackbar();

  return (
    <div className={styles.resultItem}>
      <div className={styles.resultItemHeader} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.resultItemHeaderName}>
          {/* <Icons name="erc223" /> */}
          {item.ticker}
          <a
            target="_blank"
            rel="noreferrer"
            href={getNetworkExplorerTokenUrl(1, item.tokenAddress)}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Icons name="openLink" />
          </a>
        </div>
        <div className={styles.resultItemHeaderLosses}>
          <Icons name="chevronDown" className={clsx(styles.chevron, isOpen && styles.open)} />
        </div>
      </div>
      <p>
        {/* TODO: edit CLI script */}
        {`Total losses: ${numericFormatter(
          `${(item as any).amount}`,
          {
            decimalSeparator: ".",
            thousandSeparator: ",",
            decimalScale: 0,
            suffix: ` ${item.ticker} `,
          },
        )}`}
      </p>
      <span className={styles.resultItemHeaderLossesUsd}>{`(${numericFormatter(`${item.asDollar}`, {
        decimalSeparator: ".",
        thousandSeparator: ",",
        decimalScale: 2,
        prefix: `$`,
      })})`}</span>
      <Collapse open={isOpen} style={{ width: "100%", marginTop: "12px" }}>
        {item.records.slice(0, 3).map((record) => {
          return (
            <div key={record.contract} className={styles.itemDetailsRowMobile}>
              <div>
                <p>Name</p>
                <p>—</p>
              </div>
              <div>
                <p>Contract</p>
                <p className={styles.tokenCardBalanceContract}>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={getNetworkExplorerTokenUrl(1, record.contract)}
                  >{`${renderShortAddress(record.contract, 7)}`}</a>
                  <Icons
                    name="copy"
                    onClick={async () => {
                      await navigator.clipboard.writeText(record.contract);
                      showMessage("ERC-223 Token address copied");
                    }}
                  />{" "}
                </p>
              </div>
              <div>
                <p>{`Losses, ${item.ticker}`}</p>
                <p>
                  {numericFormatter(`${record.roundedAmount}.00`, {
                    decimalSeparator: ".",
                    thousandSeparator: ",",
                    decimalScale: 2,
                    suffix: ` ${item.ticker} `,
                  })}
                </p>
              </div>
              <div>
                <p>Losses, $</p>
                <p>
                  {numericFormatter(`${record.dollarValue}`, {
                    decimalSeparator: ".",
                    thousandSeparator: ",",
                    decimalScale: 2,
                    prefix: `$`,
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <Collapse open={isDetailsShow} style={{ width: "100%" }}>
          {item.records.slice(3, item.records.length).map((record) => {
            return (
              <div key={record.contract} className={styles.itemDetailsRowMobile}>
                <div>
                  <p>Name</p>
                  <p>—</p>
                </div>
                <div>
                  <p>Contract</p>
                  <p className={styles.tokenCardBalanceContract}>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={getNetworkExplorerTokenUrl(1, record.contract)}
                    >{`${renderShortAddress(record.contract, 7)}`}</a>
                    <Icons
                      name="copy"
                      onClick={async () => {
                        await navigator.clipboard.writeText(record.contract);
                        showMessage("ERC-223 Token address copied");
                      }}
                    />{" "}
                  </p>
                </div>
                <div>
                  <p>{`Losses, ${item.ticker}`}</p>
                  <p>
                    {numericFormatter(`${record.roundedAmount}.00`, {
                      decimalSeparator: ".",
                      thousandSeparator: ",",
                      decimalScale: 2,
                      suffix: ` ${item.ticker} `,
                    })}
                  </p>
                </div>
                <div>
                  <p>Losses, $</p>
                  <p>
                    {numericFormatter(`${record.dollarValue}`, {
                      decimalSeparator: ".",
                      thousandSeparator: ",",
                      decimalScale: 2,
                      prefix: `$`,
                    })}
                  </p>
                </div>
              </div>
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
    </div>
  );
};
