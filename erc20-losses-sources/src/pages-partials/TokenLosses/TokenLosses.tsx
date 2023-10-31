import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import homeStyles from "../../styles/Home.module.scss";
import { Icons } from "@/components/atoms/Icons";
import styles from "./TokenLosses.module.scss";
import PrecalculatedResult from "@/constants/lost_tokens_result_28_10_2023_upd2.json";

/* local imports */
import { tokens, contracts } from "./const";
import { Blockchain } from "./web3";
import { numberWithCommas } from "./utils";
import clsx from "clsx";
import { numericFormatter } from "react-number-format";
import {
  PrimaryButton,
  SecondaryButton,
  WhiteButton,
  WhiteSecondaryButton,
} from "@/components/atoms/Button/Button";
import Collapse from "@/components/atoms/Collapse";
import { getNetworkExplorerTokenUrl } from "@/utils/networks";
import { renderShortAddress } from "@/utils/renderAddress";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ResultItem } from "./ResultItem";
import { MobileResultItem } from "./MobileResultItem";
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
      processSate.setResultSum(wholeSum);
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

const CalculationProgress = () => {
  const processSate: any = useContext(ProcessContext);
  const chainTokens = processSate.tokensList.split("\n");
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setProgress((processSate.resultsList.length / chainTokens.length) * 100);
  }, [chainTokens.length, processSate.resultsList.length]);

  return (
    <div
      className={clsx(
        styles.calculationProgress,
        (progress >= 100 || progress === 0) && styles.hide,
      )}
    >
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
      <p>{`Calculating ${processSate.resultsList.length}/${chainTokens.length}`}</p>
    </div>
  );
};

const ProcessContext: any = createContext(null);

const downloadResult = (data: any) => {
  // Function to convert the object to a JSON string
  const convertObjectToJSON = () => {
    return JSON.stringify(
      data,
      (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
      2,
    );
  };

  // Function to create a Blob from the JSON string
  const createBlob = () => {
    const json = convertObjectToJSON();
    return new Blob([json], { type: "application/json" });
  };

  // Function to create a download link and trigger a click event
  const downloadJSON = () => {
    const blob = createBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "erc20_losses.json"; // You can set the desired filename here
    a.click();
    URL.revokeObjectURL(url); // Clean up resources
  };

  downloadJSON();
};

// TODO
const PrecalculatedResultWithAmount = PrecalculatedResult.map((item) => {
  return {
    ...item,
    amount: item.records.reduce((acc, record) => acc + record.roundedAmount, 0),
  };
});

const PrecalculatedResultSum = PrecalculatedResultWithAmount.reduce(
  (acc, item) => acc + item.asDollar,
  0,
);
const PrecalculatedResultTokenNumber = PrecalculatedResultWithAmount.length;

export const TokenLosses = () => {
  const contractsStr = contracts[CHAIN].join("\n");
  const tokensStr = tokens[CHAIN].join("\n");

  const [contractsList, setContracts] = useState(contractsStr);
  const [tokensList, setTokens] = useState(tokensStr);
  const [resultsListStr, setResultsStr] = useState("");
  const [resultsList, setResults] = useState(PrecalculatedResultWithAmount);
  const [resultSum, setResultSum] = useState(PrecalculatedResultSum);
  const [resultTokenNumber, setResultTokenNumber] = useState(PrecalculatedResultTokenNumber);
  const [dateString, setDateString] = useState(new Date().toDateString());
  const [buttonState, setButtonState] = useState({ state: 1, text: START_TEXT }); // 0-disabled, 1-normal, 2-STOP

  const clearResults = () => {
    setResults([]);
    setResultSum(0);
  }
  const updateContractsHandler = (contracts: string) => {
    setContracts(contracts);
    clearResults();
  };
  const updateTokensListHandler = (tokens: string) => {
    setTokens(tokens);
    clearResults();
  };
  const contextObject = {
    tokensList,
    contractsList,
    resultsList,
    resultsListStr,
    setResultsStr,
    setResults,
    setResultSum,
    setResultTokenNumber,
    setDateString,
    buttonState,
    setButtonState,
  };

  const isMobile = useIsMobile();

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
                timeoutInput(updateTokensListHandler, event.target.value, "tokensList", setButtonState)
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
                timeoutInput(updateTokensListHandler, event.target.value, "contractsList", setButtonState)
              }
            ></textarea>
          </div>
        </div>
        <ProcessContext.Provider value={contextObject}>
          <Button />
          <CalculationProgress />
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

        <div className={styles.download}>
          <p>You can download the results in JSON:</p>
          <SecondaryButton onClick={() => downloadResult(resultsList)}>
            <Icons name="download" size="20px" />
            Download JSON
          </SecondaryButton>
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
              prefix: `$`,
            })}
          </p>
        </div>
        {isMobile ? (
          <div className={styles.result}>
            {resultsList.map((item, index) => {
              return <MobileResultItem key={item.tokenAddress} item={item} index={index} />;
            })}
          </div>
        ) : (
          <div className={styles.result}>
            {resultsList.map((item, index) => {
              return <ResultItem key={item.tokenAddress} item={item} index={index} />;
            })}
          </div>
        )}
      </div>
    </>
  );
};
