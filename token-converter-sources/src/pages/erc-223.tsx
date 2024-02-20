import React, { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import clsx from "clsx";
import { Manrope } from "next/font/google";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ERC223 } from "@/pages-partials/ERC223/ERC223";

export const manrope = Manrope({ subsets: ["latin"] });

export default function ERC223Page() {
  const [defaultChainId, setDefaultChainId] = useState(1);
  const [isChangeNetworkOpen, setIsChangeNetworkOpen] = useState(false);

  return (
    <>
      <Head>
        <title>ERC223 converter | ERC223</title>
        <meta name="description" content="ERC223 converter | ERC223" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={clsx(styles.main, manrope.className)}>
        <Header
          tab="ERC223"
          defaultChainId={defaultChainId}
          setDefaultChainId={setDefaultChainId}
          isChangeNetworkOpen={isChangeNetworkOpen}
          setIsChangeNetworkOpen={setIsChangeNetworkOpen}
        />
        <div className={styles.contentBlockContainer}>
          <div className={styles.contentBlock}>
            <ERC223 />
          </div>
        </div>
        <Footer />
        <div id="drawer-root" />
      </div>
    </>
  );
}
