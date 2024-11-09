import Link from "next/link";
import React from "react";

const HEADER_LINKS = [
  {
    name: "The problem",
    href: "/#problem",
    isExternal: false,
  },
  {
    name: "How these tokens are lost",
    href: "/#howTokensList",
    isExternal: false,
  },
  {
    name: "Calculator",
    href: "/#calculator",
    isExternal: false,
  },
  {
    name: "Report",
    href: "https://github.com/Dexaran/dexaran.github.io/issues",
    isExternal: true,
  },
];
export const Header = () => {
  return (
    <header
      className="hidden xl:flex mx-auto rounded-[80px] border border-border-secondary px-10 py-[6px] gap-[6px] fixed top-[20px] left-[calc(50%-712px/2)] z-10"
      style={{
        background: "rgba(18, 18, 18, 0.04)",
        boxShadow: "inset 0px 0px 20px 10px rgba(65, 65, 65, 0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
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
    </header>
  );
};
