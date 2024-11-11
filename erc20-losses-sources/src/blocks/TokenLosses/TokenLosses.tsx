import clsx from "clsx";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { numericFormatter } from "react-number-format";

import { NewButton } from "@/components/atoms/buttons/NewButton";
import Svg from "@/components/atoms/Svg";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  downloadResult,
  excludedMap,
  formatDate,
  FormattedResult,
  formatTokenResult,
  FromEtherscan,
  getTokenName,
  ProcessContext,
  START_TEXT,
  timeoutInput,
  web3,
} from "@/utils/calculations.util";

import { processOneToken } from "./functions";
import { MobileResultItem } from "./MobileResultItem";
import { ResultItem } from "./ResultItem";
import styles from "./TokenLosses.module.scss";
import { handleExclusions } from "./utils";

function Button({ fromEtherscan }: { fromEtherscan: FromEtherscan }) {
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

    // TODO add real date
    processSate.setDateString(formatDate(new Date()));

    const processedResult = handleExclusions(resultsArray, excludedMap);

    processedResult.sort(function (a, b) {
      return b.asDollar - a.asDollar;
    });

    processSate.setResults(processedResult);

    interruptFlag.current = false;
    processSate.setButtonState({ state: 1, text: START_TEXT });
  }

  return (
    <NewButton
      isLoading={processSate.buttonState.state === 2}
      disabled={!processSate.buttonState.state}
      onClick={buttonClick}
    >
      {processSate.buttonState.text}
    </NewButton>
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

const TokenName = ({ address }: { address: string }) => {
  const [appeared, setAppeared] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAppeared(true);
          }
        });
      },
      {
        root: null, // Set null for viewport or pass a container ref for a custom scrollable container
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the element is visible
      },
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, [address]);

  const [contractName, setContractName] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (appeared) {
      (async () => {
        setLoading(true);
        const name = await getTokenName(address);
        setContractName(name || "—");
        setLoading(false);
      })();
    }
  }, [appeared, address]);

  return (
    <p ref={itemRef} className="text-[16px] min-h-[24px] text-primary-text font-semibold">
      {loading ? "..." : contractName}
    </p>
  );
};

const AddressesEditor = ({
  addresses,
  onSave,
}: {
  addresses: string;
  onSave: (addresses: string) => void;
}) => {
  const addressesArray = addresses !== "" ? addresses.split("\n") : [];
  const [isEdit, setEdit] = useState(false);
  const [localAddresses, setLocalAddresses] = useState("");
  useEffect(() => {
    if (isEdit) {
      setLocalAddresses(addresses);
    }
  }, [isEdit, addresses]);
  const saveHandler = useCallback(() => {
    onSave(localAddresses);
    setEdit(false);
  }, [localAddresses, onSave]);
  const cancelHandler = () => {
    setLocalAddresses("");
    setEdit(false);
  };

  return (
    <div className="flex flex-col rounded-3 xl:rounded-[24px] relative h-full">
      <div
        className="absolute top-0 bottom-0 left-0 right-0 rounded-3 xl:rounded-[24px] pointer-events-none"
        style={{
          boxShadow: "inset 0px 0px 20px 10px rgba(83, 88, 99, 0.5)",
        }}
      />
      {/* Header */}
      <div className="flex items-center rounded-t-3 xl:rounded-t-[24px] w-full bg-tertiary-bg py-2 xl:py-[10px]">
        {!isEdit && (
          <div className="min-w-[96px] xl:min-w-[104px] pl-5 text-[14px] text-secondary-text font-semibold">
            Name
          </div>
        )}
        <div
          className={clsx(
            "flex justify-between items-center w-full px-4 xl:px-5",
            isEdit && "xl:pl-10",
          )}
        >
          <div
            className={clsx(
              "text-[14px] text-secondary-text font-semibold",
              isEdit && "hidden xl:block",
            )}
          >
            Token address
          </div>
          {isEdit ? (
            <div className="flex gap-3 w-full xl:w-auto">
              <button
                className="bg-main-primary py-2 px-6 text-[16px] font-semibold text-primary-bg rounded-2 cursor-pointer w-full xl:w-auto"
                onClick={() => saveHandler()}
              >
                Save
              </button>
              <button
                className="bg-transparent border border-primary-text py-[7px] px-6 text-[16px] font-semibold text-primary-text rounded-2 cursor-pointer w-full xl:w-auto"
                onClick={() => cancelHandler()}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="bg-main-secondary p-2 xl:pl-4 xl:pr-6 text-[16px] font-semibold text-primary-text rounded-2 flex gap-2 cursor-pointer"
              onClick={() => setEdit(true)}
            >
              <Svg iconName="edit" size={24} />
              <span className="hidden xl:block">Edit</span>
            </button>
          )}
        </div>
      </div>
      {/* Body */}
      <div
        className={clsx(
          "flex bg-secondary-bg rounded-b-3 xl:rounded-b-[24px] h-[400px] max-h-[400px]",
          !isEdit && "overflow-y-scroll overflow-x-auto",
        )}
      >
        {isEdit ? (
          <textarea
            className="w-full h-[400px] bg-textarea-bg rounded-b-3 xl:rounded-b-[24px] text-[10px] leading-[18px] xl:text-[16px] xl:leading-[36px] font-mono text-primary-text px-4 xl:px-10 py-4 resize-none"
            // disabled={buttonState.state === 2}
            value={localAddresses}
            onChange={(event) => setLocalAddresses(event.target.value)}
          />
        ) : (
          <>
            <div className="flex flex-col min-w-[96px] xl:min-w-[104px] border-r border-border-secondary gap-3 py-4 pl-5">
              {addressesArray.map((address) => (
                <TokenName key={address} address={address} />
              ))}
            </div>
            <div className="flex flex-col w-full gap-3 py-4 px-4 xl:px-5">
              {addressesArray.map((address) => (
                <p
                  key={address}
                  className="text-[16px] min-h-[24px] text-primary-text font-mono text-ellipsis overflow-hidden max-w-[164px] xl:max-w-max"
                >
                  {address}
                </p>
              ))}
              {addressesArray.length > 10 && <div className="min-h-5" />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const TokenLosses = () => {
  const isMobile = useIsMobile();
  const {
    tokensList,
    updateTokensListHandler,
    setButtonState,
    contractsList,
    updateContractsHandler,
    fromEtherscan,
    isDefaultResult,
    dateString,
    resultTokenNumber,
    resultsList,
    resultSum,
  }: any = useContext(ProcessContext);

  return (
    <div className="flex flex-col items-center" id="calculate">
      <div className="flex flex-col w-full max-w-[1280px] p-4 xl:p-10">
        <div className="flex items-center gap-2 xl:gap-10">
          <div className="flex justify-center items-center w-6 h-6 xl:w-12 xl:h-12 bg-main-secondary border xl:border-2 border-main-primary rounded-full text-[16px] xl:text-[24px] xl:font-semibold text-primary-text">
            1
          </div>
          <p className="font-goldman font-bold text-[20px] leading-[36px] xl:text-[24px] xl:leading-[40px]">
            Search for losses
          </p>
        </div>
        <div
          className="flex flex-col bg-primary-bg border-2 border-border-secondary px-4 py-3 xl:px-10 xl:py-8 rounded-3 xl:rounded-[32px] mt-4 xl:mt-10"
          style={{
            boxShadow: "inset 0px 0px 20px 10px rgba(83, 88, 99, 0.2)",
          }}
        >
          <div className="flex flex-col xl:flex-row gap-5">
            <div className="flex flex-col w-full">
              <p className="text-[18px] leading-[32px] xl:text-[20px] xl:leading-[36px] font-bold text-primary-text mb-2 xl:mb-3">
                Token addresses
              </p>
              <AddressesEditor
                addresses={tokensList}
                onSave={(addresses) => {
                  timeoutInput(updateTokensListHandler, addresses, "tokensList", setButtonState);
                }}
              />
            </div>
            <div className="flex flex-col w-full">
              <p className="text-[18px] leading-[32px] xl:text-[20px] xl:leading-[36px] font-bold text-primary-text mb-2 xl:mb-3">
                Contracts to check
              </p>
              <AddressesEditor
                addresses={contractsList}
                onSave={(addresses) => {
                  timeoutInput(updateContractsHandler, addresses, "contractList", setButtonState);
                }}
              />
            </div>
          </div>
          <div
            className="bg-secondary-bg rounded-2 mt-4 xl:mt-5 px-4 xl:px-5 py-2"
            style={{
              boxShadow: "inset 0px 4px 20px #505462",
            }}
          >
            <p className="text-primary-text text-[16px] xl:text-[18px] xl:leading-[32px]">
              When calculating lost tokens, we are pulling prices from{" "}
              <a href="https://etherscan.io/tokens" target="_blank" rel="noopener noreferrer">
                this APIs
              </a>
            </p>
          </div>
          <div className="flex xl:items-center bg-blue-bg border border-main-blue rounded-2 px-4 xl:px-5 py-2 gap-2 mt-4 xl:mt-5 mb-4 xl:mb-5">
            <Svg iconName="info" className="text-main-blue w-5 h-5 min-w-5 xl:w-6 xl:h-6" />
            <p className="text-primary-text text-[16px] xl:text-[18px] xl:leading-[32px]">
              It can take few hours to go through thousands of tokens from the default list
            </p>
          </div>
          <Button fromEtherscan={fromEtherscan} />
          <CalculationProgress isDefaultResult={isDefaultResult} />
        </div>
        <div
          id="result"
          className="flex flex-col xl:flex-row xl:justify-between xl:items-center mt-5 xl:mt-10"
        >
          <div className="flex items-center gap-2 xl:gap-10 mb-4 xl:mb-0">
            <div className="flex justify-center items-center w-6 h-6 xl:w-12 xl:h-12 bg-main-secondary border xl:border-2 border-main-primary rounded-full text-[16px] xl:text-[24px] xl:font-semibold text-primary-text">
              2
            </div>
            <p className="font-goldman font-bold text-[20px] leading-[36px] xl:text-[24px] xl:leading-[40px]">
              Results
            </p>
          </div>
          <div className="flex flex-col items-start xl:flex-row gap-2 xl:gap-0">
            <div
              className="flex items-center bg-primary-bg p-3 text-[14px] leading-[20px] xl:text-[16px] xl:leading-[24px] font-semibold text-primary-text rounded-2 gap-2"
              style={{
                boxShadow: "inset 0px 0px 20px 10px rgba(83, 88, 99, 0.2)",
              }}
            >
              <Svg iconName="calendar" size={24} className="text-secondary-text" />
              Calculation date: {dateString}
            </div>
            <div
              className="flex items-center bg-primary-bg p-3 text-[14px] leading-[20px] xl:text-[16px] xl:leading-[24px] font-semibold text-primary-text rounded-2 gap-2 xl:ml-3"
              style={{
                boxShadow: "inset 0px 0px 20px 10px rgba(83, 88, 99, 0.2)",
              }}
            >
              <Svg iconName="calculator" size={24} className="text-secondary-text" />
              Calculated for {resultTokenNumber} tokens
            </div>
            <button
              className="flex items-center bg-main-secondary py-3 pl-4 pr-6 text-[14px] leading-[20px] xl:text-[16px] xl:leading-[24px] font-semibold text-primary-text rounded-2 gap-2 cursor-pointer xl:ml-5"
              onClick={() => downloadResult(resultsList)}
            >
              <Svg iconName="download" size={24} />
              Download JSON
            </button>
          </div>
        </div>
        <div
          className="flex flex-col bg-primary-bg border-2 border-border-secondary pt-4 xl:pt-8 rounded-3 xl:rounded-[32px] mt-4 xl:mt-10"
          style={{
            boxShadow: "inset 0px 0px 20px 10px rgba(83, 88, 99, 0.2)",
          }}
        >
          <div className="px-4 xl:px-10">
            <div
              className="flex flex-col items-center xl:flex-row xl:justify-between xl:items-center px-5 py-[10px] bg-textarea-bg border border-main-red rounded-2 xl:rounded-3"
              style={{
                boxShadow: "0px 0px 24px rgba(255, 96, 96, 0.4)",
              }}
            >
              <div className="flex items-center gap-2 xl:gap-1">
                <Svg iconName="warning" size={24} className="text-main-red min-w-6" />
                <p className="text-16 xl:text-18 xl:leading-[32px] font-semibold text-primary-text">
                  Total lost of ERC-20 tokens
                </p>
              </div>
              <p className="text-[20px] leading-[36px] xl:text-[24px] xl:leading-[40px] text-main-red font-bold font-goldman">
                {numericFormatter(`${resultSum}`, {
                  decimalSeparator: ".",
                  thousandSeparator: ",",
                  decimalScale: 2,
                  prefix: `$ `,
                })}
              </p>
            </div>
          </div>
          <div className="xl:max-h-[640px] mt-4 xl:mt-10 overflow-y-auto px-4 xl:px-10">
            <div className="flex flex-col gap-5">
              {resultsList.map((item, index) => {
                return isMobile ? (
                  <MobileResultItem key={item.tokenAddress} item={item} index={index} />
                ) : (
                  <ResultItem key={item.tokenAddress} item={item} index={index} />
                );
              })}
              <div className="min-h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
