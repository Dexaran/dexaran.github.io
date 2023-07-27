import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import {useState} from "react";
import clsx from "clsx";
import Column from "../components/Column/Column";
import {events} from "../constants/events";
import RecentEvent from "../components/RecentEvent/RecentEvent";
import {articles} from "../constants/articles";
import Article from "../components/Article/Article";
import {devResources} from "../constants/dev-resources";
import {erc223} from "../constants/erc-223";
import TabHeader from "../components/TabHeader/TabHeader";
import {IResourceTab} from "../types";
import SimpleBar from "simplebar-react";

const inactiveResourceTabs: Array<{
  key: IResourceTab,
  title: string
}> = [
  {
    key: "articles",
    title: "📝 Articles"
  },
  {
    key: "erc223",
    title: "📔 ERC-223",
  },
  {
   key: "dev-sources",
   title: "👨🏻‍💻 Dev. sources"
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeResource, setActiveResource] = useState<IResourceTab>("articles");

  return (
    <div className={styles.page}>
      <Head>
        <title>ERC-223</title>
        <meta name="description" content="ERC-223 articles, events and development sources aggregator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/*<link rel="icon" href="favicon.ico" />*/}
      </Head>
      <header className={styles.header}>
        <h1>ERC-223</h1>
        <p>Designed by security experts to protect user funds from accidental loss</p>
      </header>
      <main className={styles.main}>
        <div className={styles.tabs}>
          <div className={clsx(styles.tab, activeTab === 0 && styles.active)}>
            <TabHeader
              isActive={activeTab === 0}
              arrowDirection="right"
              title="Recources"
              description={"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur eveniet, repellat. Laboriosam praesentium quasi vel voluptatibus. Deleniti necessitatibus quidem sed!"}
              handleClick={() => setActiveTab(0)}
            />
            {activeTab === 0 && <div className={styles.resources}>
              <Column description={`ERC stands for "Ethereum Request for Comments"`} title="📝 Articles">
                {articles.map(({url, title, description}) => {
                  return <Article key={title} url={url} title={title} description={description} />
                })}
              </Column>
              <Column description="Useful resources regarding ERC-223" title="📔 ERC-223">
                {erc223.map(({url, title, description}) => {
                  return <Article key={title} url={url} title={title} description={description} />
                })}
              </Column>
              <Column description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis earum neque voluptas voluptates!" title="👨🏻‍💻 Development resources">
                {devResources.map(({url, title, description}) => {
                  return <Article key={title} url={url} title={title} description={description} />
                })}
              </Column>
            </div>}
            {activeTab === 1 &&
              <div className={styles.inactiveContent}>
                <div className={styles.resourceTabs}>
                  {inactiveResourceTabs.map(({key, title}) => {
                    return <button className={clsx(styles.resourceTabButton, activeResource === key && styles.active)} key={key} onClick={() => {
                      setActiveResource(key)
                    }}>{title}</button>
                  })}
                </div>
                {activeResource === "articles" &&
                  <div className={styles.inactiveTabColumn}>
                    {articles.map(({url, title, description}) => {
                      return <Article key={title} url={url} title={title} description={description} />
                    })}
                  </div>
                }
                {activeResource === "erc223" &&
                <div className={styles.inactiveTabColumn}>
                  {erc223.map(({url, title, description}) => {
                    return <Article key={title} url={url} title={title} description={description} />
                  })}
                </div>
                }
                {activeResource === "dev-sources" &&
                <div className={styles.inactiveTabColumn}>
                  {devResources.map(({url, title, description}) => {
                    return <Article key={title} url={url} title={title} description={description} />
                  })}
                </div>
                }
              </div>
            }
          </div>
          <div className={clsx(styles.tab, activeTab === 1 && styles.active)}>
            <TabHeader
              title="Events"
              description="Here the main events and interesting discussions"
              arrowDirection="left"
              isActive={activeTab === 1}
              handleClick={() => setActiveTab(1)}
            />
            <div className={styles.eventsTabContent}>
              <Column title="📅 Latest events">
                {events.map(({url, title, date}) => {
                  return <RecentEvent key={title} url={url} title={title} date={date} />
                })}
              </Column>
            </div>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="https://callisto.network">Callisto Network</a>
        <a href="https://audits.callisto.network/">Audits Callisto Network</a>
      </footer>
    </div>
  )
}
