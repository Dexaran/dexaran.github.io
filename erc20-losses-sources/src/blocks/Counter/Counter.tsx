import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

import styles from "./Counter.module.scss";

type CounterProps = {
  number: number;
};

export const Counter: React.FC<CounterProps> = ({ number }) => {
  const numberOfDigits = number.toString().length;
  const counterRef = useRef<HTMLDivElement>(null);
  const DIGIT_HEIGHT = 40;
  const DIGIT_WIDTH = 28;
  const MARGIN_LEFT = 12;

  const updateCounter = (num: number) => {
    if (!counterRef.current) return;

    const digits = num.toString().split("").reverse();
    const digitElements = Array.from(
      counterRef.current.getElementsByClassName("digit"),
    ) as HTMLElement[];

    digitElements.forEach((digit) => {
      digit.style.marginTop = "0";
      Array.from(digit.children).forEach((child) => {
        child.classList.remove("top", "bottom");
      });
    });

    digits.forEach((d, i) => {
      const digitIndex = digitElements.length - i - 1;
      const digitElement = digitElements[digitIndex];

      const el = digitElement.children[parseInt(d)] as HTMLElement;
      digitElement.style.marginTop = `${-1 * DIGIT_HEIGHT * parseInt(d)}px`;

      setTimeout(() => {
        if (el.previousElementSibling) el.previousElementSibling.classList.add("top");
        if (el.nextElementSibling) el.nextElementSibling.classList.add("bottom");
      }, 1000);
    });
  };

  useEffect(() => {
    updateCounter(number);
  }, [number]);

  const indexesWithSpace = [...Array(numberOfDigits)]
    .map((_, i) => {
      // Calculate the index from the end
      const indexFromEnd = numberOfDigits - 1 - i;

      if (indexFromEnd % 3 === 2 && i !== 0) return i;
      return;
    })
    .filter((item) => item !== undefined);

  const getMarginLeft = (index: number) =>
    indexesWithSpace.filter((item) => index > item).length * MARGIN_LEFT;

  return (
    <div className="flex gap-2">
      <div
        className={clsx(
          "text-28 text-center min-w-[28px] font-goldman font-bold text-main-red",
          "digit",
        )}
      >
        $
      </div>
      <div
        id="counter"
        className={clsx(styles.counter, "w-full")}
        ref={counterRef}
        style={{
          width: `${numberOfDigits * DIGIT_WIDTH + indexesWithSpace.length * 12}px`,
        }}
      >
        {[...Array(numberOfDigits)].map((_, i) => (
          <div
            className={clsx(
              styles.digit,
              "text-28 text-center font-goldman font-bold text-main-red",
              indexesWithSpace.includes(i) ? "pl-3 w-[40px]" : "w-[28px]",
              "digit",
            )}
            style={{
              marginLeft: `${i * DIGIT_WIDTH + getMarginLeft(i)}px`,
            }}
            key={i}
          >
            {[...Array(10)].map((_, j) => (
              <div key={j}>{j}</div>
            ))}
          </div>
        ))}
        <div className={styles.foreground}></div>
      </div>
    </div>
  );
};
