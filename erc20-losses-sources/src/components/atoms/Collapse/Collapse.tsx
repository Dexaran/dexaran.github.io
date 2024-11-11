import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

import styles from "./Collapse.module.scss";

export function Collapse({ children, open, style }: any) {
  const [height, setHeight] = useState<number | undefined>(open ? undefined : 0);

  const isOpen = useRef<boolean>(open);

  const [overflow, setOverflow] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);
  const isChildrenChangeRef = useRef<boolean>(false);

  useEffect(() => {
    if (open) {
      setHeight(ref.current?.getBoundingClientRect().height);
      setTimeout(() => {
        setOverflow(true);
      }, 200);
    } else {
      setOverflow(false);
      setHeight(0);
    }
  }, [open]);

  useEffect(() => {
    isOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (ref.current) {
      const ro = new ResizeObserver((entries) => {
        if (!isOpen.current) {
          return;
        }

        isChildrenChangeRef.current = true;
        for (let entry of entries) {
          setHeight(entry.contentRect.height);
        }
        setTimeout(() => {
          isChildrenChangeRef.current = false;
        }, 200);
      });

      ro.observe(ref.current);

      return () => {
        ro.disconnect();
      };
    }
  }, [ref]);

  return (
    <div
      className={clsx(
        styles.collapse,
        overflow && styles.overflow,
        Boolean(isChildrenChangeRef.current) && styles.noTransition,
      )}
      style={{ height, ...(style || {}) }}
    >
      <div ref={ref}>{open ? children : null}</div>
    </div>
  );
}
