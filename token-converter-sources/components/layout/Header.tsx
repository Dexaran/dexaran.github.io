"use client";

import Image from "next/image";
import Link from "next/link";

import { basePath } from "@/config/build/paths";

import Container from "../atoms/Container";
import AccountDialog from "../dialogs/AccountDialog";
import MobileMenu from "./MobileMenu";
import Navigation from "./Navigation";
import NetworkPicker from "./NetworkPicker";

export default function Header() {
  return (
    <div>
      <header className="md:mb-3 xl:before:hidden before:h-[1px] before:bg-gradient-to-r before:from-secondary-border/20 before:via-50% before:via-secondary-border before:to-secondary-border/20 before:w-full before:absolute relative before:bottom-0 before:left-0">
        <Container className="pl-4 pr-1 md:px-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <Link
                className="relative w-7 h-8 xl:w-[35px] xl:h-10"
                href="/token-converter-sources/public"
              >
                <Image src={`${basePath}/images/logo-short.svg`} alt="" fill />
              </Link>
              <Navigation />
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <NetworkPicker />

              <div className="z-[21]">
                <AccountDialog />
              </div>

              <MobileMenu />
            </div>
          </div>
        </Container>
      </header>
    </div>
  );
}
