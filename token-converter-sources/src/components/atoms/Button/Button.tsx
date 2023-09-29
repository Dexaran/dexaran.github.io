import React, { ComponentProps } from "react";
import styles from "./Button.module.scss";

type ButtonProps = ComponentProps<"button"> & { isLoading?: boolean };
export const PrimaryButton = ({ children, isLoading, onClick, ...rest }: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${isLoading ? styles.isLoading : ""}`}
      onClick={!isLoading ? onClick : undefined}
      {...rest}
    >
      <span>{children}</span>
    </button>
  );
};

export const SecondaryButton = ({ children, isLoading, onClick, ...rest }: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${isLoading ? styles.isLoading : ""} ${styles.secondary}`}
      onClick={!isLoading ? onClick : undefined}
      {...rest}
    >
      <span>{children}</span>
    </button>
  );
};
