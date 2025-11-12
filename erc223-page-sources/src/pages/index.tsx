import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { useState } from "react";
import clsx from "clsx";
import Column from "../components/Column/Column";
import { events } from "../constants/events";
import RecentEvent from "../components/RecentEvent/RecentEvent";
import { articles } from "../constants/articles";
import Article from "../components/Article/Article";
import { devResources } from "../constants/dev-resources";
import { erc223 } from "../constants/erc-223";
import TabHeader from "../components/TabHeader/TabHeader";
import { IResourceTab } from "../types";
import { basePath } from "../constants/build-config/isProd";
import { useSnackbar } from "../providers/SnackbarProvider";
import { Footer } from "@/components/Footer/Footer";
import { MobileToolTip } from "@/components/Tooltip/Tooltip";

const inactiveResourceTabs: Array<{
  key: IResourceTab;
  title: string;
  tooltipText?: string;
  mobileTooltipText?: string;
}> = [
  {
    key: "articles",
    title: "Articles",
    tooltipText: "The most important articles written by the author of ERC-223 are pinned",
    mobileTooltipText: "The most important articles written by the author of ERC-223 are pinned",
  },
  {
    key: "erc223",
    title: "ERC-223",
    mobileTooltipText: "The most important links",
  },
  {
    key: "dev-sources",
    title: "Dev res.",
    mobileTooltipText: "Tutorials, guidelines, examples",
  },
];

const EIP223Description = (
  <>
    This page will be aggregating the updates and resources related to the adoption and development
    of{" "}
    <a href="https://eips.ethereum.org/EIPS/eip-223" target="_blank" rel="noopener noreferrer">
      ERC-223
    </a>{" "}
    standard. If you wish to contribute to the development - you can write guidelines, articles,
    code templates or spread the word about our efforts. Your content can get listed at this page
    too! You can navigate to{" "}
    <a
      href="https://github.com/Dexaran/dexaran.github.io/issues"
      target="_blank"
      rel="noopener noreferrer"
    >
      https://github.com/Dexaran/dexaran.github.io/issues
    </a>{" "}
    and open a new issue. Describe your content and it will be listed at this page in the next
    update.
  </>
);

const EventsDescription =
  "A timeline of the events surrounding the origin and development of this standard is available here.";

const mobileTabs: Array<{
  key: number;
  title: string;
  description: string | React.ReactNode;
}> = [
  {
    key: 0,
    title: "EIP-223",
    description: EIP223Description,
  },
  {
    key: 1,
    title: "Events",
    description: EventsDescription,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeResource, setActiveResource] = useState<IResourceTab>("articles");

  const [eventId, setEventId] = useState(null as null | string);

  return (
    <div className={clsx(styles.page)}>
      <Head>
        <title>ERC-223</title>
        <meta
          name="description"
          content="ERC-223 articles, events and development sources aggregator"
        />
        <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport" />
        <meta name="keywords" content="ERC-223 ethereum token standard" />
        <meta
          name="google-site-verification"
          content="KJvg15RW1iBMdz400nnEWMh7MGfMQZe19ytp_3QHBWs"
        />

        <link rel="icon" href={`${basePath}/favicon.ico`} />
      </Head>
      <header className={styles.header}>
        <img
          className={clsx(styles.bgImage, styles.leftImage)}
          src={`${basePath}/left-header-bg.png`}
          alt=""
        />
        <img
          className={clsx(styles.bgImage, styles.rightImage)}
          src={`${basePath}/right-header-bg.png`}
          alt=""
        />
        <h1>ERC-223</h1>
        <h2>
          Token standard designed by security experts. Prevents user mistakes and accidental loss of
          funds.
        </h2>
        <p>
          <a
            href="https://eips.ethereum.org/EIPS/eip-223"
            target="_blank"
            rel="noopener noreferrer"
          >
            ERC-223
          </a>{" "}
          is a token standard designed to be an alternative to{" "}
          <a href="https://eips.ethereum.org/EIPS/eip-20" target="_blank" rel="noopener noreferrer">
            ERC-20
          </a>
          .{" "}
          <a
            href="https://eips.ethereum.org/EIPS/eip-223"
            target="_blank"
            rel="noopener noreferrer"
          >
            ERC-223
          </a>{" "}
          solves a number of problems{" "}
          <a href="https://eips.ethereum.org/EIPS/eip-20" target="_blank" rel="noopener noreferrer">
            ERC-20
          </a>{" "}
          has - most notably{" "}
          <a href="https://eips.ethereum.org/EIPS/eip-20" target="_blank" rel="noopener noreferrer">
            ERC-20
          </a>{" "}
          token transfers can not be handled by the recipient which means there is no way to filter
          or prevent any user mistakes or handle any errors that may occur during the transaction.
          We believe that letting a user to lose all his life savings as a result of a mistake that
          could be easily prevented is not acceptable for a global standard of digital assets.
        </p>
      </header>

      <main className={styles.main}>
        <div>
          <div className={styles.mobileTabs}>
            {mobileTabs.map(({ key, title, description }) => {
              return (
                <button
                  className={clsx(styles.mobileTabButton, activeTab === key && styles.active)}
                  key={key}
                  onClick={() => setActiveTab(key)}
                >
                  {title}
                  <MobileToolTip>{description}</MobileToolTip>
                </button>
              );
            })}
          </div>
        </div>
        <div className={styles.tabs}>
          <div className={clsx(styles.tab, activeTab === 0 && styles.active)}>
            <TabHeader
              isActive={activeTab === 0}
              arrowDirection="right"
              title="EIP-223"
              description={EIP223Description}
              handleClick={() => setActiveTab(0)}
            />
            {activeTab === 0 && (
              <div className={styles.resources}>
                <Column
                  title="Articles"
                  description={`Articles about the tokens development`}
                  tooltipText="The most important articles written by the author of ERC-223 are pinned"
                >
                  {articles.map(({ url, title, description, image }, index) => {
                    return (
                      <Article
                        image={image}
                        animationDelay={index * 0.2}
                        key={title}
                        url={url}
                        title={title}
                        description={description}
                      />
                    );
                  })}
                </Column>
                <Column title="ERC-223" description="The most important links">
                  {erc223.map(({ url, title, description, image }, index) => {
                    return (
                      <Article
                        image={image}
                        animationDelay={index * 0.2}
                        key={title}
                        url={url}
                        title={title}
                        description={description}
                      />
                    );
                  })}
                </Column>
                <Column title="Development resources" description="Tutorials, guidelines, examples">
                  {devResources.map(({ url, title, description, image }, index) => {
                    return (
                      <Article
                        image={image}
                        animationDelay={index * 0.2}
                        key={title}
                        url={url}
                        title={title}
                        description={description}
                      />
                    );
                  })}
                </Column>
              </div>
            )}
            <div className={clsx(styles.inactiveContent, activeTab === 1 && styles.active)}>
              <div className={styles.resourceTabs}>
                {inactiveResourceTabs.map(({ key, title, tooltipText, mobileTooltipText }) => {
                  return (
                    <button
                      className={clsx(
                        styles.resourceTabButton,
                        activeResource === key && styles.active,
                      )}
                      key={key}
                      onClick={() => {
                        setActiveResource(key);
                      }}
                    >
                      {title}
                      {mobileTooltipText ? (
                        <MobileToolTip>{mobileTooltipText}</MobileToolTip>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              {activeResource === "articles" && (
                <div className={clsx(styles.inactiveTabColumn, "scrollbar")}>
                  {articles.map(({ url, title, description, image }, index) => {
                    return (
                      <Article
                        image={image}
                        animationDelay={index * 0.2}
                        key={title}
                        url={url}
                        title={title}
                        description={description}
                      />
                    );
                  })}
                </div>
              )}
              {activeResource === "erc223" && (
                <div className={clsx(styles.inactiveTabColumn, "scrollbar")}>
                  {erc223.map(({ url, title, description, image }, index) => {
                    return (
                      <Article
                        image={image}
                        animationDelay={index * 0.2}
                        key={title}
                        url={url}
                        title={title}
                        description={description}
                      />
                    );
                  })}
                </div>
              )}
              {activeResource === "dev-sources" && (
                <div className={clsx(styles.inactiveTabColumn, "scrollbar")}>
                  {devResources.map(({ url, title, description, image }, index) => {
                    return (
                      <Article
                        image={image}
                        animationDelay={index * 0.2}
                        key={title}
                        url={url}
                        title={title}
                        description={description}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className={clsx(styles.tab, activeTab === 1 && styles.active)}>
            <TabHeader
              title="Events"
              description={EventsDescription}
              arrowDirection="left"
              isActive={activeTab === 1}
              handleClick={() => setActiveTab(1)}
            />
            <div className={styles.eventsTabContent}>
              <Column title="📅 Events timeline (Total: 68 publications)">
                {events.map(({ url, urls, title, date, id, color }) => {
                  return (
                    <RecentEvent
                      key={title}
                      url={url}
                      urls={urls}
                      title={title}
                      date={date}
                      color={color}
                      isHighlighted={!!eventId && eventId === id}
                      onMouseEnter={() => {
                        setEventId(id || null);
                      }}
                      onMouseLeave={() => setEventId(null)}
                    />
                  );
                })}
              </Column>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
