"use client";

import clsx from "clsx";
import Image from "next/image";

import { basePath } from "@/config/build/paths";
import { IconName } from "@/types/IconName";

import Container from "../atoms/Container";
import IconButton, { IconButtonSize, IconButtonVariant } from "../atoms/IconButton";
import Svg from "../atoms/Svg";

type SocialLink = {
  title: any;
  href: string;
  icon: Extract<IconName, "website" | "github">;
};

const socialLinks: SocialLink[] = [
  {
    title: "DEX223 Exchange",
    href: "https://app.dex223.com/",
    icon: "website",
  },
  {
    title: "Github",
    href: "https://github.com/Dexaran/dexaran.github.io",
    icon: "github",
  },
];

function FooterLink({ href, title, icon }: SocialLink) {
  return (
    <>
      <a
        target="_blank"
        href={href}
        className={clsx(
          "lg:w-auto text-12 lg:text-16 flex gap-2 bg-primary-bg rounded-5 lg:py-2 lg:pr-4 lg:pl-5 p-2 hover:bg-green-bg hover:text-primary-text text-secondary-text duration-200 w-full whitespace-nowrap justify-center items-center",
        )}
      >
        {title}
        <Svg className="!w-4 !h-4 lg:!w-6 lg:!h-6" iconName={icon} />
      </a>
    </>
  );
}

export default function Footer() {
  return (
    <>
      <footer className="mt-6 md:mt-[80px] before:h-[1px] before:bg-gradient-to-r before:from-secondary-border/20 before:via-50% before:via-secondary-border before:to-secondary-border/20 before:w-full before:absolute relative before:top-0 before:left-0">
        <Container className="max-w-[1920px]">
          <div className="flex justify-between pt-4 pb-3 px-4 md:px-5 items-center flex-col sm:flex-row gap-3">
            <div className="rounded-20 p-1 flex items-center max-sm:justify-between gap-2 bg-primary-bg max-sm:order-1 max-sm:w-full">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 md:h-8 md:w-8 relative shrink-0">
                  <Image src={`${basePath}/images/donut.svg`} alt={""} fill />
                </div>
                <p className="max-md:text-12 text-tertiary-text">
                  Donations appreciated:{" "}
                  <span className="text-primary-text">0x2ca1377dfa...e7d</span>
                </p>
              </div>

              <IconButton
                buttonSize={IconButtonSize.SMALL}
                variant={IconButtonVariant.COPY}
                text={"0x2ca1377dfa03577ce5bbb815c98eda1ac7632e7d"}
              />
            </div>
            <a
              className="text-12 md:text-16 text-tertiary-text underline hover:text-green duration-200 max-sm:order-3"
              href="https://www.gnu.org/licenses/gpl-3.0.en.html"
            >
              GPLv3
            </a>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto max-sm:order-2">
              {socialLinks.map((socialLink) => {
                return <FooterLink key={socialLink.title} {...socialLink} />;
              })}
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}
