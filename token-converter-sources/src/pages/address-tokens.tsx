import React, { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import clsx from "clsx";
import { Manrope } from "next/font/google";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { AddressBalance } from "@/pages-partials/AddressBalance/AddressBalance";

export const manrope = Manrope({ subsets: ["latin"] });

export default function Home() {
  const [defaultChainId, setDefaultChainId] = useState(1);
  const [isChangeNetworkOpen, setIsChangeNetworkOpen] = useState(false);

  return (
    <>
      <Head>
        <title>ERC223 converter | View address tokens</title>
        <meta name="description" content="ERC223 converter | View address tokens" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={clsx(styles.main, manrope.className)}>
        <Header
          tab="addressBalance"
          defaultChainId={defaultChainId}
          setDefaultChainId={setDefaultChainId}
          isChangeNetworkOpen={isChangeNetworkOpen}
          setIsChangeNetworkOpen={setIsChangeNetworkOpen}
        />
        <div className={styles.contentBlockContainer}>
          <div className={styles.contentBlock}>
            <AddressBalance defaultChainId={defaultChainId} />
          </div>
        </div>
        <Footer />
        <div id="drawer-root" />
      </div>
    </>
  );
}
