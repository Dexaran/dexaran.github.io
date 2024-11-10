import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

import Drawer from "@/components/atoms/Drawer/Drawer";
import Svg from "@/components/atoms/Svg";
import { IconName } from "@/constants/IconName";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { renderShortAddress } from "@/utils/renderAddress";

import { ADDRESS_FOR_DONATION, USERFUL_LINKS } from "./Footer";

const HEADER_LINKS = [
  {
    name: "The problem",
    href: "/#problem",
    isExternal: false,
    iconName: "problem" as IconName,
  },
  {
    name: "How these tokens are lost",
    href: "/#howTokensList",
    isExternal: false,
    iconName: "question-tag" as IconName,
  },
  {
    name: "Calculator",
    href: "/#calculator",
    isExternal: false,
    iconName: "calculator" as IconName,
  },
  {
    name: "Report",
    href: "https://github.com/Dexaran/dexaran.github.io/issues",
    isExternal: true,
    iconName: "report" as IconName,
  },
];
export const Header = () => {
  const { showMessage } = useSnackbar();

  const [menuOpen, setMenuOpen] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      setMenuOpen(false);
    },
  });

  // useEffect(() => {
  //   if (window.location.hash) {
  //     const hash = window.location.hash.replace("#", "");
  //     const element = document.getElementById(hash);

  //     if (element) {
  //       const top = element.getBoundingClientRect();
  //       if (top.y > 1) {
  //         window.scrollTo({
  //           top: top.y,
  //           left: 0
  //         })
  //       }
  //     }

  //   }
  // }, []);

  return (
    <header
      className="flex rounded-[80px] border border-border-secondary p-3 xl:px-10 xl:py-[6px] gap-[6px] fixed top-[16px] xl:top-[20px] right-[16px] xl:right-[calc(50%-712px/2)] z-10 duration-200"
      style={{
        background: "rgba(18, 18, 18, 0.04)",
        boxShadow: "inset 0px 0px 20px 10px rgba(65, 65, 65, 0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* DESKTOP Links */}
      <div className="hidden xl:flex">
        {HEADER_LINKS.map(({ name, href, isExternal }) => (
          <Link
            key={name}
            href={href}
            target={isExternal && "_blank"}
            rel={isExternal && "noopener noreferrer"}
            className="px-4 py-2 text-[18px] leading-[32px] font-semibold text-primary-text duration-200 rounded-[50px] hover:no-underline hover:text-main-primary hover:bg-primary-bg"
          >
            {name}
          </Link>
        ))}
      </div>
      {/* Mobile Burger Button */}
      <div className="flex xl:hidden cursor-pointer" onClick={() => setMenuOpen(true)}>
        <Svg iconName="menu" />
      </div>
      {/* Drawer */}
      <Drawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} position="left">
        <div
          {...handlers}
          className="flex flex-col justify-between bg-textarea-bg h-full max-h-[100svh]"
        >
          <div className="flex flex-col">
            <div className="flex flex-col py-4">
              {HEADER_LINKS.map(({ name, href, isExternal, iconName }) => (
                <Link
                  key={name}
                  href={href}
                  target={isExternal && "_blank"}
                  rel={isExternal && "noopener noreferrer"}
                  className="flex px-4 py-3 text-[16px] font-semibold text-primary-text duration-200 hover:no-underline hover:text-main-primary hover:bg-primary-bg gap-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <Svg iconName={iconName} size={24} />
                  {name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2 px-4 pt-6 border-t border-border-secondary">
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
          </div>
          {/* Footer */}
          <div className="p-4">
            <div
              className="flex flex-col p-4 pb-0 border-2 border-border-secondary rounded-3 bg-primary-bg"
              style={{
                boxShadow: "inset 0px 0px 20px 10px rgba(83, 88, 99, 0.2);",
              }}
            >
              <p className="text-[14px] leading-[20px] text-secondary-text">
                This is a non-profit project, but donations appreciated:
              </p>
              <div className="flex items-center">
                <p
                  className="text-green cursor-pointer text-[14px] leading-[20px]"
                  onClick={async () => {
                    await navigator.clipboard.writeText(ADDRESS_FOR_DONATION);
                    showMessage("Wallet address copied");
                  }}
                >
                  {renderShortAddress(ADDRESS_FOR_DONATION, 11)}
                </p>
                <div
                  className="flex justify-center items-center w-10 h-10 cursor-pointer duration-200 hover:text-green text-primary-text"
                  onClick={async () => {
                    await navigator.clipboard.writeText(ADDRESS_FOR_DONATION);
                    showMessage("Wallet address copied");
                  }}
                >
                  <Svg iconName="copy" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
};
