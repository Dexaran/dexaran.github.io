import React from "react";
import styles from "./Checkbox.module.scss";

interface Props {
  checked: boolean,
  handleChange: any,
  id: string
}

export default function Checkbox({ checked, handleChange, id }: Props) {
  return <div className={styles.wrapper}>
    <input
      checked={checked}
      onChange={handleChange}
      className={styles.checkboxInput}
      id={id}
      type="checkbox"
    />
    <label className={styles.checkbox} htmlFor={id}>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M8.80786 16.355C8.35376 16.355 7.97534 16.1743 7.67261 15.813L3.89331 11.2354C3.76147 11.084 3.6687 10.9375 3.61499 10.7959C3.56128 10.6543 3.53442 10.5078 3.53442 10.3564C3.53442 10.0098 3.64917 9.72412 3.87866 9.49951C4.11304 9.27002 4.40601 9.15527 4.75757 9.15527C5.14819 9.15527 5.4729 9.31396 5.73169 9.63135L8.77856 13.4033L14.7625 3.94775C14.9138 3.71826 15.0701 3.55713 15.2312 3.46436C15.3972 3.3667 15.5999 3.31787 15.8391 3.31787C16.1907 3.31787 16.4812 3.43018 16.7107 3.65479C16.9402 3.87939 17.0549 4.1626 17.0549 4.50439C17.0549 4.63135 17.033 4.76318 16.989 4.8999C16.9451 5.03662 16.8767 5.17822 16.7839 5.32471L9.96509 15.7617C9.69653 16.1572 9.31079 16.355 8.80786 16.355Z" fill="currentColor"/>
        </svg>
      </span>
    </label>
  </div>;
}
