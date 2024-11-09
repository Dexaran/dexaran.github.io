import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

import Svg from "@/components/atoms/Svg";
import NeonBlock from "@/components/organisms/NeonBlock";
import { clsxMerge } from "@/utils/clsxMerge";

import {
  BeincryptoPost,
  Etherscan,
  GitHubComment,
  RedditComment,
  RedditPost,
  TwitterComment,
} from "./Posts";

const slides = [
  {
    id: 1,
    content: (
      <>
        <p className="text-primary-text text-[18px] leading-[32px] xl:text-[20px] font-bold mb-2 xl:mb-4">
          The user lost his money
        </p>
        <RedditPost
          redditLogo="/posts/post6.png"
          redditName="0xProject"
          nickname="cryptoassetmana"
          title="I’ve sent my tokens to the ZRX smart contract address.. pls help me"
          link="https://www.reddit.com/r/0xProject/comments/7lpc5n/ive_sent_my_tokens_to_the_zrx_smart_contract/"
          content={
            <div className="flex flex-col gap-3 text-[16px]">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://etherscan.io/address/0xe41d2489571d322189246dafa5ebde1f4699f498#tokentxns"
                className="text-[#6D8DF4]"
              >
                {`https://etherscan.io/address/
                0xe41d2489571d322189246da
                fa5ebde1f4699f498#tokentxns`}
              </a>
              <p className="whitespace-pre-line text-[16px] text-[#B7CAD4]">
                {`I’ve sent 13,631 SALT tokens to the ZRX smart contract address. Is there any way i can retrieve my tokens? I really hope to recover it immediately but if that’s not possible, will the 0x team implement erc223 standard to resolve such horrifying situations??
                      
                      I’m a big fan of 0x project and i have deep affection in the community. I beg you guys, pls help me solve this problem. Thank you all.`}
              </p>
            </div>
          }
        />
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.reddit.com/r/0xProject/comments/7lpc5n/ive_sent_my_tokens_to_the_zrx_smart_contract/"
          className="text-[12px] xl:text-[16px] mt-2 whitespace-pre-line"
        >
          {`https://www.reddit.com/r/0xProjectcomments/ 
          7lpc5nive_sent_my_tokens_to_the_zrx_smart_contract/`}
        </a>
        <p className="text-primary-text text-[18px] leading-[32px] xl:text-[20px] font-bold mb-2 xl:mb-4 mt-4">
          A lot of money was deposited into the contract
        </p>
        <RedditPost
          redditLogo="/posts/post4.png"
          redditName="ethereum"
          nickname="Dexaran"
          title="4 hours ago $240K worth of CRO were deposited to the address of USDT contract"
          link="https://www.reddit.com/r/0xProject/comments/7lpc5n/ive_sent_my_tokens_to_the_zrx_smart_contract/"
          content={
            <div className="flex flex-col gap-3 text-[16px]">
              <p className="whitespace-pre-line text-[16px] text-[#B7CAD4]">
                {`A user just sent 4,800,000 CRO to the address of USDT smart-contract `}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://etherscan.io/tx/0x4e3f1853dc4bfeb2a5cd4ebbc79d0853ad993d5368bed19d8195d64928e11ac2"
                  className="text-[#6D8DF4]"
                >
                  <span className="hidden xl:inline">
                    {`https://etherscan.io/tx/0x4e3f1853dc4bfeb2a5cd4
                    ebbc79d0853ad993d5368bed19d8195d64928e11ac2`}
                  </span>
                  <span className="xl:hidden">
                    {`https://etherscan.io/tx/
                  0x4e3f1853dc4bfeb2a5cd
                  4ebbc79d0853ad993d5368
                  bed19d8195d64928e11ac2`}
                  </span>
                </a>
              </p>
            </div>
          }
        />
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.reddit.com/r/ethereum/comments/16bqvj8/4_hours_ago_240k _worth_of_cro_were_deposited_to/"
          className="text-[12px] xl:text-[16px] mt-2 whitespace-pre-line"
        >
          {`https://www.reddit.com/r/ethereumcomments/
          16bqvj8/4_hours_ago_240k_worth_of_cro_were
          _deposited_to/`}
        </a>
      </>
    ),
  },
  {
    id: 2,
    content: (
      <>
        <p className="text-primary-text text-[18px] leading-[32px] xl:text-[20px] font-bold mb-2 xl:mb-4">
          Article about lost tokens
        </p>
        <BeincryptoPost />
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://beincrypto.com/1-million-usdt-nearly-lost-to-simple-user-error/"
          className="text-[12px] xl:text-[16px] mt-2 whitespace-pre-line"
        >
          {`https://beincrypto.com/1-million-usdt-nearly-lost-to-
          simple-user-error/`}
        </a>
        <p className="text-primary-text text-[18px] leading-[32px] xl:text-[20px] font-bold mb-2 xl:mb-4 mt-4 xl:mt-10">
          Loss due to Permit2
        </p>
        <TwitterComment
          logo="/posts/post5.png"
          name="Scam Sniffer | Web3 Anti-Scam"
          nickname="@realScamSniffer"
          content={
            <p className="whitespace-pre-line text-[#F7F9F9]">
              another victim lost about $339k worth of <span className="text-[#82C7F6]">$USDC</span>{" "}
              by Uniswap Permit2 Phishing 57 mins ago.
            </p>
          }
          link="https://x.com/realScamSniffer/status/1686761980365832197"
        />
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://x.com/realScamSniffer/status/1686761980365832197"
          className="text-[12px] xl:text-[16px] mt-2 whitespace-pre-line"
        >
          {`https://x.com/realScamSniffer/status/
          1686761980365832197`}
        </a>
      </>
    ),
  },
  {
    id: 3,
    content: (
      <>
        <p className="text-primary-text text-[18px] leading-[32px] xl:text-[20px] font-bold mb-2 xl:mb-4">
          Where can you see lost tokens on Etherscan?
        </p>
        <Etherscan />
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://etherscan.io/address/0xB8c77482e45F1F44dE1745F52C74426C631bDD52"
          className="text-[12px] xl:text-[16px] mt-2 whitespace-pre-line"
        >
          {`https://etherscan.io/address/
          0xB8c77482e45F1F44dE1745F52C74426C631bDD52`}
        </a>
      </>
    ),
  },
];

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInit, setInit] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play effect
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 6000);
    }

    if (!isInit) {
      // setIsPlaying(true);
      // setInit(true);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, isPlaying, isInit]);

  const togglePlayPause = () => {
    if (!isPlaying) {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col">
      <p className="xl:hidden text-[20px] leading-[36px] font-bold my-4">
        Public records of ERC-20 losses on media
      </p>
      <div className="flex justify-between items-center mb-4">
        <div
          className="flex justify-center items-center border xl:border-2 border-text-primary rounded-full min-w-10 min-h-10 cursor-pointer"
          onClick={togglePlayPause}
        >
          <Svg iconName={isPlaying ? "pause" : "play"} size={24} color="white" />
        </div>
        <div className="flex gap-3 xl:gap-5">
          {slides.map((slide, index) => {
            return (
              <div
                key={slide.id}
                className={`relative overflow-hidden w-[69px] xl:w-[104px] h-3 rounded-[20px] bg-tertiary-bg`}
              >
                <div
                  className={clsxMerge(
                    "absolute top-0 left-0 h-full bg-green transition-all ease-linear w-0 duration-0",
                    isPlaying && index === currentSlide && "w-full duration-[6s]",
                  )}
                ></div>
                <div
                  className={clsxMerge(
                    "absolute top-0 left-0 h-full bg-green transition-all ease-linear w-0 duration-0",
                    isPlaying
                      ? index < currentSlide && "w-full"
                      : index <= currentSlide && "w-full",
                  )}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col min-h-[960px]">{slides[currentSlide].content}</div>
    </div>
  );
};

export const HowTokensLost = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex max-w-[1280px] p-4 xl:p-10 pt-0 gap-10">
        <NeonBlock
          icon="question-tag"
          color="red"
          overlineText="How these tokens are lost?"
          anchor="howTokensList"
          leftContent={
            <div className="flex flex-col gap-4 w-full text-[16px] xl:text-[18px] text-[#E3E3E3]">
              <p>
                {`Most often, users mistakenly send tokens to a contract that is not intended to operate with tokens, for example, to the contract address of the token itself. Such a contract cannot send tokens, it is not intended to hold tokens at all, it is intended to be the token.`}
              </p>
              <p>
                {`However, this is just the tip of the iceberg and it is easy to calculate how many tokens were lost this way (which is exactly what this script does). In fact, every deposit of tokens to a contract that does not allow sending tokens out and was performed using the "transfer()" function results in the loss of tokens, but calculation of the total loss amount would require an analysis of all transactions in the entire history of Ethereum.`}
              </p>
            </div>
          }
          rightContent={<Slideshow />}
        />
      </div>
    </div>
  );
};
