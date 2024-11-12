import React from "react";

import { ShowMoreMobile } from "@/components/atoms/ShowMore";
import NeonBlock from "@/components/organisms/NeonBlock";
import { useIsMobile } from "@/hooks/useIsMobile";

import { GitHubComment, RedditComment, RedditPost, TwitterComment } from "./Posts";

export const Problem = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col items-center">
      <div className="flex max-w-[1280px] p-4 xl:p-10 pt-[60px] xl:pt-[160px] gap-10">
        <NeonBlock
          icon="problem"
          color="red"
          overlineText="The problem"
          anchor="problem"
          withoutTopLine={true}
          leftContent={
            <div className="flex flex-col gap-2 xl:gap-4 w-full text-16 xl:text-18 text-[#E3E3E3]">
              <p>
                {`ERC-20 standard implements two methods of transferring tokens. One is designed for address-to-address transfers, another is designed for contract deposits. Both methods do not implement error handling which is a major security flaw. By the standard the burden of determining the method of transferring tokens is placed on the user and in case of picking a "wrong" method for a contract deposit the tokens get permanently stuck.`}
              </p>
              <p>
                You can find a full description of the problem in{" "}
                <a
                  href="https://dexaran820.medium.com/known-problems-of-erc20-token-standard-e98887b9532c"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  this article
                </a>
                .
              </p>
              <ShowMoreMobile>
                <div className="flex flex-col gap-2 xl:gap-4 w-full text-16 xl:text-18 text-[#E3E3E3]">
                  <p>
                    {`The problem was discovered in 2017. At the moment of disclosure there were $16,000 worth of tokens lost.`}
                  </p>
                  <p>
                    {`In 2018 there were approximately $1,000,000 worth of funds lost because of this ERC-20 standard flaw.`}
                  </p>
                  <p>
                    {`As of 11/1/2023 there were $60,000,000 worth of ERC-20 tokens lost. The amount is growing every day because there is no easy solution other than switching to a more secure standard.`}
                  </p>
                </div>
              </ShowMoreMobile>
              <p className="text-[20px] leading-[36px] font-bold text-primary-text xl:hidden">
                Historical discussions
              </p>

              <div className="hidden xl:flex flex-col xl:mt-4">
                <RedditComment
                  logo="/posts/post7.png"
                  nickname="Frdwrd"
                  postLink="https://www.reddit.com/r/storj/comments/6ajjo3/comment/dhf95qz/"
                  link="https://www.reddit.com/r/storj/comments/6ajjo3/comment/dhf95qz/"
                  content={
                    <p className="whitespace-pre-line text-14 xl:text-16 text-[#F2F2F2]">
                      {`Hey Dexaran,
                    
                    While preparing to make a decision, we read ERC23 and ERC223 as well as your previous threads on the subject. We decided to err on the side of well-tested code.`}
                    </p>
                  }
                />
                <a
                  href="https://www.reddit.com/r/storj/comments/6ajjo3/comment/dhf95qz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] xl:text-[16px] mt-2"
                >
                  {`https://www.reddit.com/r/storj/comments
                /6ajjo3/comment/dhf95qz/`}
                </a>
              </div>
            </div>
          }
          rightContent={
            <div className="flex flex-col pt-4 xl:pt-0">
              <div className="flex flex-col">
                <GitHubComment
                  logo="/posts/post1.png"
                  nickname="Dexaran"
                  date="Apr 24, 2017"
                  tags={["Contributor"]}
                  content={
                    <div className="flex flex-col gap-4">
                      <p>
                        I want to draw attention to the fact that there are two ways to transfer
                        tokens in the ERC20 standard:
                      </p>
                      <div className="flex flex-col pl-3 gap-4">
                        <p>
                          1.{" "}
                          <span className="bg-[#343942] font-mono rounded-[6px] px-[6px] py-1">
                            transfer
                          </span>
                        </p>
                        <p>
                          2.{" "}
                          <span className="bg-[#343942] font-mono rounded-[6px] px-[6px] py-1">
                            approve
                          </span>
                          {` + `}
                          <span className="bg-[#343942] font-mono rounded-[6px] px-[6px] py-1">
                            transferFrom
                          </span>
                        </p>
                      </div>
                      <p>
                        There is no way to handle{" "}
                        <span className="bg-[#343942] font-mono rounded-[6px] px-[6px] py-1">
                          transfer
                        </span>{" "}
                        function calls. As a result, choosing the wrong way to transfer tokens will
                        result in a loss of money.
                      </p>
                    </div>
                  }
                />
                <div className="flex pl-4 xl:pl-[72px]">
                  <div className="min-h-[32px] w-[3px] bg-border-secondary" />
                </div>
                <GitHubComment
                  logo="/posts/post3.png"
                  nickname="frozeman"
                  date="Apr 24, 2017"
                  tags={["Contributor", "Author"]}
                  content={
                    <p>
                      I do find this idea very useful, but at the same time we also should get the
                      ERC 20 finalised as many tokens already us it. We can then make an ERC 23 for
                      a new version based on ERC 20
                    </p>
                  }
                />
                <a
                  href="https://github.com/ethereum/EIPs/pull/610#issuecomment-296711733"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] xl:text-[16px] xl:pl-[48px] mt-2 whitespace-pre-line"
                >
                  {`https://github.com/ethereum/EIPs/pull/610
                  #issuecomment-296711733`}
                </a>
              </div>
              <div className="xl:hidden flex flex-col mt-4">
                <RedditComment
                  logo="/posts/post7.png"
                  nickname="Frdwrd"
                  postLink="https://www.reddit.com/r/storj/comments/6ajjo3/comment/dhf95qz/"
                  link="https://www.reddit.com/r/storj/comments/6ajjo3/comment/dhf95qz/"
                  content={
                    <p className="whitespace-pre-line text-14 xl:text-16 text-[#F2F2F2]">
                      {`Hey Dexaran,
                    
                    While preparing to make a decision, we read ERC23 and ERC223 as well as your previous threads on the subject. We decided to err on the side of well-tested code.`}
                    </p>
                  }
                />
                <a
                  href="https://www.reddit.com/r/storj/comments/6ajjo3/comment/dhf95qz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] xl:text-[16px] mt-2"
                >
                  {`https://www.reddit.com/r/storj/comments
                /6ajjo3/comment/dhf95qz/`}
                </a>
              </div>
              <div className="flex flex-col mt-4 xl:mt-10">
                <TwitterComment
                  logo="/posts/post2.png"
                  name="Fabian Vogelsteller"
                  nickname="@feindura"
                  content={
                    <p className="whitespace-pre-line text-[#F7F9F9]">
                      {`Btw. I don’t want to see any ERC20 on LUKSO ☝️

                  Only LSP7! ✌️ Otherwise you will have no users, as people want standards that show up in their 🆙 automagically`}
                    </p>
                  }
                  link="https://x.com/feindura/status/1676623784726470658"
                />
                <a
                  href="https://x.com/feindura/status/1676623784726470658"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] xl:text-[16px] mt-2"
                >
                  {`https://x.com/feindura/status/1676623784726470658`}
                </a>
              </div>
              <div className="flex flex-col mt-4 xl:mt-10">
                <TwitterComment
                  logo="/posts/post5.png"
                  name="Scam Sniffer | Web3 Anti-Scam"
                  nickname="@realScamSniffer"
                  content={
                    <p className="whitespace-pre-line text-[#F7F9F9]">
                      {`the victim gave the token approval to the scammer by signing "increaseAllowance" transactions.`}
                    </p>
                  }
                  link="https://x.com/realScamSniffer/status/1710423552380502331"
                />
                <a
                  href="https://x.com/realScamSniffer/status/1710423552380502331"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] xl:text-[16px] mt-2 whitespace-pre-line"
                >
                  {`https://x.com/realScamSniffer/status/
                  1710423552380502331`}
                </a>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};
