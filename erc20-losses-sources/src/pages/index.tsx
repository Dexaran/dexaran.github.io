import clsx from "clsx";
import { Goldman, Open_Sans } from "next/font/google";
import Head from "next/head";
import React, { createContext, useEffect, useState } from "react";
import Web3 from "web3";

import { basePath } from "@/constants/build-config/isProd";
import {
  CHAIN,
  formatDate,
  PrecalculatedResultSum,
  PrecalculatedResultTokenNumber,
  preparedResult,
  ProcessContext,
  START_TEXT,
  useEtherscan,
} from "@/utils/calculations.util";

import { Calculator } from "../blocks/Calculator";
import { Footer } from "../blocks/Footer";
import { Header } from "../blocks/Header";
import { Hero } from "../blocks/Hero";
import { HowTokensLost } from "../blocks/HowTokensLost";
import { Problem } from "../blocks/Problem";
import { contracts } from "../blocks/TokenLosses/const";
import { TokenLosses } from "../blocks/TokenLosses/TokenLosses";

export const goldman = Goldman({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-goldman",
});
export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
});

export default function Home() {
  const { isEtherscanLoading, fromEtherscan, etherscanList } = useEtherscan();
  const contractsStr = contracts[CHAIN].join("\n");

  const [contractsList, setContracts] = useState(contractsStr);
  const [tokensList, setTokens] = useState("");
  const [resultsList, setResults] = useState(preparedResult);
  const [isDefaultResult, setIsDefaultResult] = useState(true);

  const [resultSum, setResultSum] = useState(PrecalculatedResultSum);
  const [resultTokenNumber, setResultTokenNumber] = useState(PrecalculatedResultTokenNumber);

  const [dateString, setDateString] = useState(formatDate(new Date()));
  const [buttonState, setButtonState] = useState({ state: 1, text: START_TEXT }); // 0-disabled, 1-normal, 2-STOP

  // Update tokens list with etherscan result
  useEffect(() => {
    setTokens(etherscanList);
  }, [etherscanList, setTokens]);

  const clearResults = () => {
    setResults([]);
    setResultSum(0);
    setIsDefaultResult(false);
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
    resultSum,
    setResultSum,
    resultTokenNumber,
    setResultTokenNumber,
    dateString,
    setDateString,
    buttonState,
    setButtonState,
    updateContractsHandler,
    updateTokensListHandler,
    isDefaultResult,
    fromEtherscan,
  };

  return (
    <>
      <Head>
        <title>ERC-20 Losses Calculator</title>
        <meta
          name="description"
          content="ERC-20 token standard contains a security flaw in its transferring workflow. As the result a user can lose their funds."
        />
      </Head>
      <ProcessContext.Provider value={contextObject}>
        <div
          className={clsx(
            openSans.variable,
            goldman.variable,
            "font-openSans flex flex-col min-h-[100svh]",
          )}
        >
          <Header />
          <Hero />
          <Problem />
          <HowTokensLost />
          <Calculator />
          <TokenLosses />
          <Footer />
          <div id="drawer-root" />
        </div>
      </ProcessContext.Provider>
    </>
  );
}
