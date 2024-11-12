import Link from "next/link";
import React, { useContext } from "react";
import { numericFormatter } from "react-number-format";

import { ProcessContext } from "@/utils/calculations.util";

import { NewButton } from "../components/atoms/buttons/NewButton";
import { Counter } from "./Counter";

export const Hero = () => {
  const { resultSum, dateString }: any = useContext(ProcessContext);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col xl:flex-row max-w-[1280px] p-4 xl:p-10 pt-[120px] xl:pt-[240px] gap-10">
        <div className="flex flex-col w-full order-2 xl:order-1">
          <h1 className="text-[36px] leading-[48px] xl:text-[66px] xl:leading-[68px] font-goldman text-primary-text">
            <span className="text-green">ERC-20</span> Losses Calculator
          </h1>
          <p className="text-16 xl:text-[18px] text-primary-text mt-3 mb-8">
            ERC-20 token standard contains a security flaw in its transferring workflow. As the
            result a user can lose their funds.
          </p>
          <Link href="/#calculate">
            <NewButton className="w-max">Launch calculator</NewButton>
          </Link>
        </div>
        <div className="flex flex-col w-full items-center justify-center order-1 xl:order-2">
          <h1 className="text-[20px] leading-[36px] xl:text-[24px] xl:leading-[40px] font-goldman text-primary-text">
            Amount of money lost
          </h1>
          <p className="text-secondary-text mb-3">Last update: {dateString}</p>
          <Counter number={Math.floor(resultSum)} />
          <div className="w-[320px] xl:w-[580px] mt-1">
            <div
              className="w-full h-[12px] rounded-[100%]"
              style={{
                background: "linear-gradient(90deg, #9D2B2B 0%, #FF5050 49%, #9D2B2B 100%)",
                boxShadow: "0px 14px 40px 20px rgba(123, 13, 13, 0.35)",
                filter: "blur(6.5px)",
              }}
            />
            <div
              className="w-full h-[10px] rounded-b-[800px]"
              style={{
                background: "radial-gradient(50% 479.25% at 50% -61.72%, #CC3A3A 0%, #121212 100%)",
                filter: "blur(37px)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
