import styles from "./TabHeader.module.scss";
import clsx from "clsx";
import {basePath} from "../../constants/build-config/isProd";

interface Props {
  title: string,
  description: string,
  arrowDirection: "left" | "right",
  isActive: boolean,
  handleClick: () => void
}

export default function TabHeader({title, description, arrowDirection, isActive, handleClick}: Props) {
  return <div className={styles.tabHeader}>
    <h3 className={styles.tabTitle}>
      <span>{title}</span>
      {!isActive && <button className={clsx(styles.arrowButton, styles[arrowDirection])} onClick={handleClick} disabled={isActive}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.6338 11.6543C16.6338 11.874 16.5459 12.0674 16.3789 12.2344L9.41797 19.0459C9.25977 19.2041 9.06641 19.2832 8.83789 19.2832C8.38965 19.2832 8.03809 18.9404 8.03809 18.4834C8.03809 18.2549 8.12598 18.0615 8.2666 17.9121L14.665 11.6543L8.2666 5.39648C8.12598 5.24707 8.03809 5.04492 8.03809 4.8252C8.03809 4.36816 8.38965 4.02539 8.83789 4.02539C9.06641 4.02539 9.25977 4.10449 9.41797 4.25391L16.3789 11.0742C16.5459 11.2324 16.6338 11.4346 16.6338 11.6543Z" fill="currentColor"/>
        </svg>
        <img className={styles.arrowGlow} src={`${basePath}/arrow-glow.png`} alt=""/>
      </button>}
    </h3>
    <p className={styles.tabDescription}>{description}</p>
  </div>
}
