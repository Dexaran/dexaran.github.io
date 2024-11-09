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
            <div className="flex flex-col gap-4 w-full text-[18px] text-[#E3E3E3]">
              <p>
                {`For each token contract address in a left input the script calculates how much of this token is permanently stuck in all the addresses from the right input.`}
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
