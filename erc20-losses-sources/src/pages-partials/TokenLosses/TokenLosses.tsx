import React, { createContext, useContext, useRef, useState } from "react";
import homeStyles from "../../styles/Home.module.scss";
import { Icons } from "@/components/atoms/Icons";
import styles from "./TokenLosses.module.scss";
import PrecalculatedResult from "@/constants/lost_tokens_result_13_10_2023.json"

/* local imports */
import { tokens, contracts } from "./const";
import { Blockchain } from "./web3";
import { numberWithCommas } from "./utils";
import clsx from "clsx";
import { numericFormatter } from "react-number-format";
import { PrimaryButton, SecondaryButton, WhiteButton, WhiteSecondaryButton } from "@/components/atoms/Button/Button";
import Collapse from "@/components/atoms/Collapse";
/* globals */
const CHAIN = "eth"; // eth or bsc or polygon
const web3 = new Blockchain(CHAIN);
const timeoutMap: Map<string, NodeJS.Timeout> = new Map();
type FormattedResult = { resStr: string; asDollar: number; amount: number };

const START_TEXT = "Start search";

function parseAddress(address: string): string {
  let result: string[] = [];
  const list = address.split(/\n|;|,|;\n|,\n/);

  for (const l of list) {
    const name = l.trim();
    if (web3.checkEthAddress(name)) {
      result.push(name);
    }
    // TODO list and show invalid (excluded) addresses to user
  }

  // dedupe
  result = Array.from(new Set(result));

  return result.join("\n");
}

function timeoutInput(setter: any, value: string, areaName: string, setButtonState: any) {
  setter(value);

  setButtonState({ state: 0, text: "Checking addresses..." });

  if (timeoutMap.has(areaName)) {
    clearTimeout(timeoutMap.get(areaName));
  }

  // Set up new one
  const timeoutId = setTimeout(function () {
    setter(parseAddress(value));
    setButtonState({ state: 1, text: START_TEXT });
  }, 5000);
  timeoutMap.set(areaName, timeoutId);
}

function formatTokenResult(res: any): FormattedResult {
  let localStr = "";

  if (!res.ticker) {
    // invalid token
    return { resStr: `??? [${res.tokenAddress}] - unknown token\n`, asDollar: 0, amount: 0 };
  }

  if (res.price === -1) {
    // can't get price
    return {
      resStr: `${res.ticker} [${res.tokenAddress}]: not checked - no price found\n`,
      asDollar: 0,
      amount: 0,
    };
  }

  // normal process
  let sum = 0n;

  // records already sorted by value - formatting output
  for (const record of res.records) {
    const str = `Contract ${record.contract} => ${numberWithCommas(record.roundedAmount)} ${
      res.ticker
    } ( $${record.dollarValue} )`;
    sum += record.amount;
    localStr += str + "\n";
  }

  // increasing sum value
  const roundedAmount = Number(sum) / Number(`1e${res.decimals}`);
  const asDollar = roundedAmount * res.price;

  const header = `${res.ticker} [${res.tokenAddress}]: ${numberWithCommas(
    roundedAmount,
  )} tokens lost / $${numberWithCommas(asDollar)}`;
  localStr = header + "\n-----------------------------------------------\n" + localStr;

  return { resStr: localStr, asDollar, amount: roundedAmount };
}

function Button() {
  const processSate: any = useContext(ProcessContext);
  const interruptFlag = useRef(false);

  async function buttonClick() {
    if (processSate.buttonState.state === 2) {
      // if process is ongoing
      interruptFlag.current = true;
      processSate.setButtonState({ state: 0, text: "Aborting search..." });
      return;
    }

    processSate.setButtonState({ state: 2, text: "Stop Searching" });

    // exclude duplicates
    const chainContracts = processSate.contractsList.split("\n");
    const chainTokens = processSate.tokensList.split("\n");

    if (chainTokens[0] === "") {
      processSate.setButtonState({ state: 1, text: START_TEXT });
      return;
    }

    if (chainContracts[0] === "") {
      chainContracts[0] = chainTokens[0];
    }
    const contractListArray: string[] = Array.from(new Set(chainContracts.concat(chainTokens)));

    const resultsArray: any[] = [];
    let wholeSum = 0;
    let resStr = "";
    let counter = 0;

    for (const tokenAddress of chainTokens) {
      // if (processSate.stopClicked) break; // stop by button
      if (interruptFlag.current) break; // stop by button

      const res = await web3.processOneToken(contractListArray, tokenAddress);

      const formatted: FormattedResult = formatTokenResult(res);
      resStr += formatted.resStr + "\n";

      wholeSum += formatted.asDollar;
      resultsArray.push({
        ...res,
        asDollar: formatted.asDollar,
        amount: formatted.amount,
      });
      // TODO
      processSate.setResults(resultsArray);

      processSate.setResultsStr(resStr);
      processSate.setResultSum(`$${numberWithCommas(wholeSum)}`);
      processSate.setResultTokenNumber(++counter);
    }

    processSate.setDateString(new Date().toDateString());

    resultsArray.sort(function (a, b) {
      return b.asDollar - a.asDollar;
    });
    // TODO
    processSate.setResults(resultsArray);

    resStr = "";
    for (const res of resultsArray) {
      const formatted = formatTokenResult(res);
      resStr += formatted.resStr + "\n";
      processSate.setResultsStr(resStr);
    }

    interruptFlag.current = false;
    processSate.setButtonState({ state: 1, text: START_TEXT });
  }

  return (
    <WhiteButton
      isLoading={processSate.buttonState.state === 2}
      disabled={!processSate.buttonState.state}
      onClick={buttonClick}
    >
      {processSate.buttonState.text}
    </WhiteButton>
  );
}

const ProcessContext: any = createContext(null);


const ResultItem = ({ item, index }: { item: any; index: number }) => {
  const [isOpen, setIsOpen] = useState(false); // index < 3
  const [isDetailsShow, setDetailsShow] = useState(false);

  return (
    <div className={styles.resultItem}>
      <div className={styles.resultItemHeader} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.resultItemHeaderName}>
          <Icons name="erc223" />
          {item.ticker}
        </div>
        <div className={styles.resultItemHeaderLosses}>
          <p>
            {/* TODO: edit CLI script */}
            {`Total losses: ${numericFormatter(`${(item as any).amount}`, {
              decimalSeparator: ".",
              thousandSeparator: ",",
              decimalScale: 2,
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
          <p>Contracts</p>
          <p>{`Losses, ${item.ticker}`}</p>
          <p>Losses, $</p>
        </div>
        {item.records.slice(0, 3).map((record) => {
          return (
            <div key={record.contract} className={styles.itemDetailsRow}>
              <p>{record.contract}</p>
              <p>
                {numericFormatter(`${record.roundedAmount}.00`, {
                  decimalSeparator: ".",
                  thousandSeparator: ",",
                  decimalScale: 2,
                  suffix: ` ${item.ticker} `,
                })}
              </p>
              <p>
                {numericFormatter(`${record.dollarValue}`, {
                  decimalSeparator: ".",
                  thousandSeparator: ",",
                  decimalScale: 2,
                  prefix: `$`,
                })}
              </p>
            </div>
          );
        })}
        <Collapse open={isDetailsShow} style={{ width: "100%" }}>
          {item.records.slice(3, item.records.length).map((record) => {
            return (
              <div key={record.contract} className={styles.itemDetailsRow}>
                <p>{record.contract}</p>
                <p>
                  {numericFormatter(`${record.roundedAmount}.00`, {
                    decimalSeparator: ".",
                    thousandSeparator: ",",
                    decimalScale: 2,
                    suffix: ` ${item.ticker} `,
                  })}
                </p>
                <p>
                  {numericFormatter(`${record.dollarValue}`, {
                    decimalSeparator: ".",
                    thousandSeparator: ",",
                    decimalScale: 2,
                    prefix: `$`,
                  })}
                </p>
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

export const TokenLosses = () => {
  const contractsStr = contracts[CHAIN].join("\n");
  const tokensStr = tokens[CHAIN].join("\n");

  const [contractsList, setContractcs] = useState(contractsStr);
  const [tokensList, setTokens] = useState(tokensStr);
  const [resultsListStr, setResultsStr] = useState("");
  const [resultsList, setResults] = useState(PrecalculatedResult);
  const [resultSum, setResultSum] = useState("$ 00.00");
  const [resultTokenNumber, setResultTokenNumber] = useState(0);
  const [dateString, setDateString] = useState(new Date().toDateString());
  const [buttonState, setButtonState] = useState({ state: 1, text: START_TEXT }); // 0-disabled, 1-normal, 2-STOP

  const contextObject = {
    tokensList,
    contractsList,
    resultsListStr,
    setResultsStr,
    setResults,
    setResultSum,
    setResultTokenNumber,
    setDateString,
    buttonState,
    setButtonState,
  };

  return (
    <>
      <div className={styles.searchBlock}>
        <div className={styles.step}>
          <span>1</span>
          <p>Search for losses</p>
        </div>
        <div className={styles["group-3"]}>
          <div className={styles["textarea-container"]}>
            <p className={styles["wallet-address"]}>
              <label>Token addresses</label>
            </p>
            <textarea
              className={styles["textarea-list"]}
              disabled={buttonState.state === 2}
              value={tokensList}
              onChange={(event) =>
                timeoutInput(setTokens, event.target.value, "tokensList", setButtonState)
              }
            ></textarea>
          </div>
          <div className={styles["textarea-container"]}>
            <p className={styles["wallet-address"]}>
              <label>Contracts to check</label>
            </p>
            <textarea
              className={styles["textarea-list"]}
              disabled={buttonState.state === 2}
              value={contractsList}
              onChange={(event) =>
                timeoutInput(setContractcs, event.target.value, "contractsList", setButtonState)
              }
            ></textarea>
          </div>
        </div>
        <ProcessContext.Provider value={contextObject}>
          <Button />
        </ProcessContext.Provider>
      </div>
      <div className={styles.resultBlock}>
        <div className={styles.resultBlockHeader}>
          <div className={styles.step}>
            <span>2</span>
            <p>Result</p>
          </div>
          <div className={styles.resultBlockHeaderInfo}>
            <div className={styles.infoTag}>
              <Icons name="calendar" />
              <span>Data recalculation: {dateString}</span>
            </div>
            <div className={styles.infoTag}>
              <Icons name="calculate" />
              <span>Calculated for {resultTokenNumber} tokens</span>
            </div>
          </div>
        </div>

        <div className={styles.totalLosses}>
          <div className={styles.totalLossesText}>
            <Icons name="warning" />
            Total lost of ERC-20 tokens
          </div>
          <p>
            {numericFormatter(`${resultSum}`, {
              decimalSeparator: ".",
              thousandSeparator: ",",
              decimalScale: 2,
            })}
          </p>
        </div>
        <div className={styles.result}>
          {resultsList.map((item, index) => {
            return <ResultItem key={item.tokenAddress} item={item} index={index} />;
          })}
        </div>
      </div>
    </>
  );
};
