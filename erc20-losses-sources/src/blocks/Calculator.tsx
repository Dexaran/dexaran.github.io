import React from "react";

import NeonBlock from "@/components/organisms/NeonBlock";

import { GitHubComment, RedditComment, RedditPost, TwitterComment } from "./Posts";

export const Calculator = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex max-w-[1280px] p-4 xl:p-10 pt-0 gap-10">
        <NeonBlock
          icon="calculator"
          color="green"
          overlineText="Calculator"
          anchor="calculator"
          // withoutTopLine={true}
          leftContent={
            <div className="flex flex-col gap-4 w-full text-[16px] leading-[24px] xl:text-[18px] xl:leading-[32px] text-[#E3E3E3]">
              <p>
                {`For each token contract address in the left input the script calculates how much of this tokens are permanently stuck in all the addresses from both the right and the left inputs.`}
              </p>
              <p>
                {`Found a problem with the script? `}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/Dexaran/dexaran.github.io/issues/new"
                >
                  Report problem
                </a>
                .
              </p>
            </div>
          }
          rightContent={<div className="flex flex-col gap-10"></div>}
        />
      </div>
    </div>
  );
};
