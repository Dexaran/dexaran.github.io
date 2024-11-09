import React, { ReactNode } from "react";

import Svg from "@/components/atoms/Svg";

export const GitHubComment = ({
  logo,
  nickname,
  date,
  tags,
  content,
}: {
  logo: string;
  nickname: string;
  date: string;
  tags: string[];
  content: ReactNode;
}) => {
  return (
    <div className="flex gap-[10px]">
      <img
        src={logo}
        alt="photo"
        height={38}
        width={38}
        className="w-[38px] h-[38px] border border-[#30363D] rounded-full hidden xl:block"
      />
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center text-[15px] bg-[#161B22] px-4 xl:px-[18px] py-2 xl:py-[11px] rounded-t-[6px] border border-[#30363D]">
          <div className="flex justify-start gap-1">
            <p className="font-bold text-[12px] leading-[12px] xl:text-[16px] xl:leading-[16px]">
              {nickname}
            </p>
            <p className="text-[#848D97] text-[12px] leading-[12px] xl:text-[16px] xl:leading-[16px]">{`commented on ${date}`}</p>
          </div>
          <div className="flex justify-end items-center gap-[11px]">
            <div className="hidden xl:flex items-center gap-1">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex justify-center items-center border border-[#30363D] px-[7px] py-[2px] text-[12px] rounded-[40px] text-[#848D97]"
                >
                  {tag}
                </div>
              ))}
            </div>
            <div>
              <Svg iconName="github-dots" color="#848D97" size={20} />
            </div>
          </div>
        </div>
        {/* Body */}
        <div className="px-[18px] py-[15px] bg-[#0D1117] rounded-b-[6px] border border-[#30363D] border-t-0 text-[14px] xl:text-[16px] font-medium">
          {content}
        </div>
      </div>
    </div>
  );
};

export const TwitterComment = ({
  logo,
  name,
  nickname,
  content,
  link,
}: {
  logo: string;
  name: string;
  nickname: string;
  content: ReactNode;
  link: string;
}) => {
  return (
    <div className="flex flex-col bg-[#17202A] px-[16px] py-[14px] border border-[#455362] rounded-[12px] gap-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-1 items-center">
          <img
            src={logo}
            alt="photo"
            height={48}
            width={48}
            className="w-[48px] h-[48px] rounded-full"
          />
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <p className="font-bold text-[14px] xl:text-[16px] text-[#F7F9F9] text-ellipsis overflow-hidden text-nowrap max-w-[160px] xl:max-w-max">
                {name}
              </p>
              <Svg iconName="x-check" color="#F7F9F9" size={16} />
            </div>
            <div className="flex gap-[6px] items-center">
              <p className="text-[14px] xl:text-[16px] text-[#8B98A5]">{nickname}</p>
              <div className="w-[2px] h-[2px] rounded-full bg-[#8B98A5]" />
              <p className="text-[#82C7F6] text-[14px] xl:text-[16px] font-bold">Follow</p>
            </div>
          </div>
        </div>
        {/* X */}
        <Svg iconName="x-logo" color="#F7F9F9" size={24} />
      </div>
      {/* Body */}
      <div className="text-[14px] xl:text-[16px] font-medium">{content}</div>
    </div>
  );
};

export const RedditPost = ({
  redditName,
  redditLogo,
  nickname,
  title,
  content,
  link,
}: {
  redditName: string;
  redditLogo: string;
  nickname: string;
  title: string;
  content: ReactNode;
  link: string;
}) => {
  return (
    <div className="flex flex-col bg-[#0D1416] px-[16px] py-[16px] border border-[#3A444C] rounded-[8px]">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-2">
          <img
            src={redditLogo}
            alt="photo"
            height={48}
            width={48}
            className="w-[34px] h-[34px] min-w-[34px] xl:w-[48px] xl:h-[48px] xl:min-w-[48px] rounded-full"
          />
          <div className="h-[100%] w-[1px] bg-[#303030]" />
        </div>
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-center min-h-[34px] xl:min-h-[48px]">
            <div className="flex gap-1 items-center">
              <p className="font-bold text-[13px] text-[#F2F2F2]">{redditName}</p>
              <p className="text-[13px] text-[#8BA2AD] text-ellipsis overflow-hidden text-nowrap max-w-[88px] xl:max-w-max">{`Posted by ${nickname}`}</p>
            </div>
            <img
              src="/reddit-logo.svg"
              alt="reddit-logo"
              width={104}
              height={24}
              className="w-[69px] xl:w-[104px]"
            />
          </div>
          {/* Title */}
          <p className="text-[14px] xl:text-[22px] text-[#F2F2F2] font-semibold">{title}</p>
          {/* Content */}
          <div className="text-[14px] xl:text-[16px]">{content}</div>
        </div>
      </div>
    </div>
  );
};

export const RedditComment = ({
  logo,
  nickname,
  content,
  link,
  postLink,
}: {
  logo: string;
  nickname: string;
  content: ReactNode;
  link: string;
  postLink: string;
}) => {
  return (
    <div className="flex flex-col bg-[#0D1416] px-[16px] py-[16px] border border-[#3A444C] rounded-[8px]">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-2">
          <img
            src={logo}
            alt="photo"
            height={48}
            width={48}
            className="w-[34px] h-[34px] min-w-[34px] rounded-full"
          />
          <div className="h-[100%] w-[1px] bg-[#303030]" />
        </div>
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-center min-h-[34px]">
            <div className="flex gap-1 items-center">
              <p className="font-bold text-[12px] xl:text-[13px] text-[#F2F2F2]">{nickname}</p>
              <p className="text-[12px] xl:text-[13px] text-[#8BA2AD] text-nowrap text-ellipsis overflow-hidden max-w-[96px] xl:max-w-max">
                commented on <span className="text-[#6D8DF4] font-semibold">post</span>
              </p>
            </div>
            <img
              src="/reddit-logo.svg"
              alt="reddit-logo"
              width={104}
              height={24}
              className="w-[69px] xl:w-[104px]"
            />
          </div>
          {/* Content */}
          <div className="text-[16px]">{content}</div>
        </div>
      </div>
    </div>
  );
};

export const BeincryptoPost = () => {
  return (
    <div className="flex flex-col bg-white px-4 py-4 xl:px-5 xl:py-5 border border-border-secondary rounded-3 xl:rounded-[20px]">
      <div className="flex gap-4">
        <p className="text-[12px] text-[#10161F]">
          <span className="text-[#2E5FF1]">Home</span>/Technology
        </p>
        <p className="text-[12px] text-[#D25E26]">News Report</p>
      </div>
      <p className="text-[24px] leading-[32px] font-bold text-[#10161F] mt-4">
        1 Million USDT Nearly Lost to Simple User Error
      </p>
      <div className="flex items-center gap-1 mt-2">
        <Svg iconName="clock" color="#10161F" size={16} />
        <p className="text-[12px] text-[#10161F]">1 min</p>
      </div>
      <div className="flex justify-between gap-4 mt-4">
        <div className="flex gap-2 w-full">
          <img
            src="/posts/post9.png"
            alt="photo"
            height={33}
            width={33}
            className="hidden xl:block w-[33px] h-[33px] rounded-full"
          />
          <div className="flex flex-col justify-center">
            <p className="text-[10px] leading-[16px] text-[#10161F]">
              By <span className="text-[#2E5FF1]">Colin Adams</span>
            </p>
            <p className="text-[10px] leading-[16px] text-[#10161F] mt-[1px]">
              8 September 2020, 10:45 GMT+0000
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <img
            src="/posts/post8.png"
            alt="photo"
            height={33}
            width={33}
            className="hidden xl:block w-[33px] h-[33px] rounded-full"
          />
          <div className="flex flex-col justify-center">
            <p className="text-[10px] leading-[16px] text-[#10161F]">
              Updated by <span className="text-[#2E5FF1]">Kyle Baird</span>
            </p>
            <p className="text-[10px] leading-[16px] text-[#10161F] mt-[1px]">
              9 September 2020, 10:31 GMT+0000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export const Etherscan = () => {
  return (
    <div className="flex flex-col border border-border-secondary rounded-[12px] overflow-hidden">
      <img
        src="/posts/etherscan.png"
        alt="photo"
        width={580}
        height={398}
        className="hidden xl:block w-full"
      />
      <img
        src="/posts/etherscan_mobile.png"
        alt="photo"
        width={296}
        height={558}
        className="block xl:hidden w-full"
      />
    </div>
  );
};
