import axios from "axios";
import dayjs from "dayjs";
import { createContext, useEffect, useState } from "react";
import Web3 from "web3";

import { rpcMap } from "@/blocks/TokenLosses/const";
import { checkEthAddress, getTokenInfo, loadExcludes } from "@/blocks/TokenLosses/functions";
import { handleExclusions, numberWithCommas } from "@/blocks/TokenLosses/utils";
import PrecalculatedResult from "@/constants/lost_tokens_result_23_10_2025.json";

export const START_TEXT = "Start search";
export const CHAIN = "eth"; // eth or bsc or polygon
export const rpc = rpcMap.get("eth");

// can use any of supported chains
export const web3 = new Web3(rpc);

export type FormattedResult = { resStr: string; asDollar: number; amount: number };
export type EtherscanTokenInfo = {
  rank: number;
  name: string;
  logo?: string;
  sympol: string;
  price: number;
  updated: string;
};
export type FromEtherscan = { [address: string]: EtherscanTokenInfo };

export const timeoutMap: Map<string, NodeJS.Timeout> = new Map();

export function formatTokenResult(res: any): FormattedResult {
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

const EXCLUDES = true; // turn ON using of exceptions/exclusions

export const excludedMap = loadExcludes();

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

export const preparedResult = handleExclusions(PrecalculatedResult, excludedMap);

preparedResult.sort(function (a, b) {
  return b.asDollar - a.asDollar;
});

export const PrecalculatedResultSum = preparedResult.reduce((acc, item) => acc + item.asDollar, 0);
export const PrecalculatedResultTokenNumber = preparedResult.length;

const API_ETHERSCAN_ENDPOINT = "https://api.dex223.io/v1/cache/explores/tokens/prices?explorer=etherscan";
export const useEtherscan = () => {
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

export function parseAddress(address: string): string {
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

export function timeoutInput(setter: any, value: string, areaName: string, setButtonState: any) {
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

export const downloadResult = (data: any) => {
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

export const ProcessContext: any = createContext(null);

export const getTokenName = async (address: string, tokenObject?: any) => {
  const tokenInfo = await getTokenInfo(web3, address, tokenObject);
  return tokenInfo.ticker;
};

export const formatDate = (date: Date) => dayjs(date).format("D MMM, YYYY");
