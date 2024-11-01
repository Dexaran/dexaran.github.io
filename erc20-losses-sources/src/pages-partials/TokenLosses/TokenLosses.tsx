import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Icons } from "@/components/atoms/Icons";
import styles from "./TokenLosses.module.scss";
import PrecalculatedResult from "@/constants/lost_tokens_result_31_10_2024.json";

/* local imports */
import { tokens, contracts, rpcMap } from "./const";
import { handleExclusions, numberWithCommas } from "./utils";
import clsx from "clsx";
import { numericFormatter } from "react-number-format";
import { SecondaryButton, WhiteButton } from "@/components/atoms/Button/Button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ResultItem } from "./ResultItem";
import { MobileResultItem } from "./MobileResultItem";
import { checkEthAddress, loadExcludes, processOneToken } from "./functions";
import Web3 from "web3";
import axios from "axios";

/* globals */
const CHAIN = "eth"; // eth or bsc or polygon
export const rpc = rpcMap.get("eth");
const timeoutMap: Map<string, NodeJS.Timeout> = new Map();
type FormattedResult = { resStr: string; asDollar: number; amount: number };
const excludedMap = loadExcludes();
const EXCLUDES = true; // turn ON using of exceptions/exclusions
const API_ETHERSCAN_ENDPOINT = "https://api.dex223.io/v1/etherscan/";
// can use any of supported chains
export const web3 = new Web3(rpc);

const START_TEXT = "Start search";

function parseAddress(address: string): string {
  let result: string[] = [];
  const list = address.split(/\n|;|,|;\n|,\n/);

  for (const l of list) {
    const name = l.trim();
    if (checkEthAddress(web3, name)) {
      result.push(name);
    }
    // TODO list and show invalid (excluded) addresses to user
  }

  // dedupe
  result = Array.from(new Set(result));

  return result.join("\n");
}

function timeoutInput(
  setter: any,
  value: string,
  areaName: string,
  setButtonState: any,
) {
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

function Button({ fromEtherscan }: { fromEtherscan: FromEtherscan; }) {
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
    let counter = 0;

    for (const tokenAddress of chainTokens) {
      // if (processSate.stopClicked) break; // stop by button
      if (interruptFlag.current) break; // stop by button

      const token = fromEtherscan[tokenAddress.toLowerCase()];
      const res = await processOneToken(web3, contractListArray, tokenAddress, token);

      const formatted: FormattedResult = formatTokenResult(res);

      wholeSum += formatted.asDollar;
      resultsArray.push({
        ...res,
        asDollar: formatted.asDollar,
        amount: formatted.amount,
      });
      // TODO
      const preparedResult = handleExclusions(resultsArray, excludedMap);
      processSate.setResults(preparedResult);
      processSate.setResultSum(preparedResult.reduce((acc, item) => acc + item.asDollar, 0));
      processSate.setResultTokenNumber(++counter);
    }

    processSate.setDateString(new Date().toDateString());

    const processedResult = handleExclusions(resultsArray, excludedMap);

    processedResult.sort(function (a, b) {
      return b.asDollar - a.asDollar;
    });

    processSate.setResults(processedResult);

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

const CalculationProgress = ({ isDefaultResult }: { isDefaultResult: boolean }) => {
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
        (isDefaultResult || progress >= 100 || progress === 0) && styles.hide,
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

// TODO turn on/off exclusions
if (EXCLUDES) {
  // mark excluded results
  for (const res of PrecalculatedResult) {
    const tokenAddress = res.tokenAddress.toLowerCase();
    if (excludedMap.has(tokenAddress)) {
      const excluded = excludedMap.get(tokenAddress);
      for (let item of res.records) {
        if (excluded?.includes(item.contract.toLowerCase())) {
          (item as any).exclude = true;
        }
      }
    }
  }
}

const preparedResult = handleExclusions(PrecalculatedResult, excludedMap);

preparedResult.sort(function (a, b) {
  return b.asDollar - a.asDollar;
});

const PrecalculatedResultSum = preparedResult.reduce((acc, item) => acc + item.asDollar, 0);
const PrecalculatedResultTokenNumber = preparedResult.length;

type EtherscanTokenInfo = {
  rank: number;
  name: string;
  logo?: string;
  sympol: string;
  price: number;
  updated: string;
}
type FromEtherscan ={ [address: string]: EtherscanTokenInfo }

const useEtherscan = () => {
  const [isEtherscanLoading, setIsEtherscanLoading] = useState(true);
  const [fromEtherscan, setFromEtherscan] = useState({} as FromEtherscan);
  const [etherscanList, setEtherscanList] = useState("");

  useEffect(() => {
    (async () => {
      setIsEtherscanLoading(true);
      const resultEtherscan = await axios.get(API_ETHERSCAN_ENDPOINT);
      setFromEtherscan(resultEtherscan.data);
      let prefix = "";
      let counter = 0;
      let etherscanListResult = "";
      for (const address of Object.keys(resultEtherscan.data)) {
        // Using the default iterator (could be `map.entries()` instead)
        etherscanListResult += prefix + address;
        prefix = "\n";
        counter++;
      }
      setEtherscanList(etherscanListResult);

      console.log(`Contracts found on Etherscan: ${counter}`);
      setIsEtherscanLoading(false);
    })();
  }, [setFromEtherscan, setEtherscanList]);

  return {
    isEtherscanLoading,
    fromEtherscan,
    etherscanList,
  };
};

export const TokenLosses = () => {
  const { isEtherscanLoading, fromEtherscan, etherscanList } = useEtherscan();
  const contractsStr = contracts[CHAIN].join("\n");

  const [contractsList, setContracts] = useState(contractsStr);
  const [tokensList, setTokens] = useState("");
  const [resultsList, setResults] = useState(preparedResult);
  const [isDefaultResult, setIsDefaultResult] = useState(true);
  
  const [resultSum, setResultSum] = useState(PrecalculatedResultSum);
  const [resultTokenNumber, setResultTokenNumber] = useState(PrecalculatedResultTokenNumber);
  const [dateString, setDateString] = useState(new Date().toDateString());
  const [buttonState, setButtonState] = useState({ state: 1, text: START_TEXT }); // 0-disabled, 1-normal, 2-STOP

  // Update tokens list with etherscan result
  useEffect(() => {
    setTokens(etherscanList);
  }, [etherscanList, setTokens]);

  const clearResults = () => {
    setResults([]);
    setResultSum(0);
    setIsDefaultResult(false)
  };
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
                timeoutInput(
                  updateTokensListHandler,
                  event.target.value,
                  "tokensList",
                  setButtonState,
                )
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
                timeoutInput(
                  updateContractsHandler,
                  event.target.value,
                  "contractsList",
                  setButtonState,
                )
              }
            ></textarea>
          </div>
        </div>
        <ProcessContext.Provider value={contextObject}>
          <Button fromEtherscan={fromEtherscan} />
          <CalculationProgress isDefaultResult={isDefaultResult} />
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
            Total amount of lost ERC-20 tokens
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
