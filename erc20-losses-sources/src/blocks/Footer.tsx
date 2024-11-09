import React from "react";

import Svg from "@/components/atoms/Svg";
import { useSnackbar } from "@/providers/SnackbarProvider";

import { NewButton } from "../components/atoms/buttons/NewButton";
const ADDRESS_FOR_DONATION = "0x2ca1377dfa03577ce5bbb815c98eda1ac7632e7d";

const USERFUL_LINKS = [
  {
    name: "ERC-223 page",
    href: "https://dexaran.github.io/erc223/",
  },
  {
    name: "ERC-20 security flaw",
    href: "https://medium.com/dex223/known-problems-of-erc20-token-standard-e98887b9532c",
  },
  {
    name: "Problems of ERC-20 standard",
    href: "https://dexaran820.medium.com/security-problems-of-erc-20-standard-cc2a1e300441",
  },
  {
    name: "Callisto Security statement",
    href: "https://callisto.network/erc-20-standard-security-department-statement/",
  },
];
const SOCIAL_MEDIA_LINKS = [
  {
    name: "ERC-223 X account",
    href: "#",
  },
];

export const Footer = () => {
  const { showMessage } = useSnackbar();

  return (
    <footer className="flex flex-col items-center border-t border-[#383B3A] mt-4 xl:mt-[160px]">
      <div className="max-w-[1280px] w-full flex justify-between px-5 py-4 xl:px-10 xl:py-5">
        <div className="hidden xl:flex gap-10">
          <div className="flex flex-col gap-2">
            <p className="text-[14px] text-secondary-text font-semibold mb-1">Useful links</p>
            {USERFUL_LINKS.map(({ name, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-text hover:text-green duration-200"
              >
                {name}
              </a>
            ))}
          </div>
          {/* <div className="flex flex-col gap-2">
            <p className="text-[14px] text-secondary-text font-semibold mb-1">Social media</p>
            {SOCIAL_MEDIA_LINKS.map(({ name, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-text hover:text-green duration-200"
              >
                {name}
              </a>
            ))}
          </div> */}
        </div>
        <div className="hidden xl:flex flex-col justify-between gap-10">
          <div
            className="flex flex-col px-5 pt-4 pb-[6px] border-2 border-border-secondary rounded-3 bg-primary-bg"
            style={{
              boxShadow: "inset 0px 0px 20px 10px rgba(83, 88, 99, 0.2);",
            }}
          >
            <p>This is a non-profit project, but donations appreciated:</p>
            <div className="flex items-center">
              <p
                className="text-green cursor-pointer"
                onClick={async () => {
                  await navigator.clipboard.writeText(ADDRESS_FOR_DONATION);
                  showMessage("Wallet address copied");
                }}
              >
                {ADDRESS_FOR_DONATION}
              </p>
              <div
                className="flex justify-center items-center w-10 h-10 cursor-pointer duration-200 hover:text-green"
                onClick={async () => {
                  await navigator.clipboard.writeText(ADDRESS_FOR_DONATION);
                  showMessage("Wallet address copied");
                }}
              >
                <Svg iconName="copy" size={24} />
              </div>
            </div>
          </div>
          <p className="text-end text-secondary-text">© 2024 ERC-20 Losses Calculator</p>
        </div>
        <p className="xl:hidden text-[12px] leading-[16px] w-full text-center text-secondary-text">
          © 2024 ERC-20 Losses Calculator
        </p>
      </div>
    </footer>
  );
};
