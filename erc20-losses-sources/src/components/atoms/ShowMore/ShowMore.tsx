import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";

import Svg from "../Svg";

export function ShowMoreMobile({ children, style }: any) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false); // index < 3
  const isOpen = !isMobile || open;
  const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0);

  const [overflow, setOverflow] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);
  const isChildrenChangeRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setHeight(ref.current?.getBoundingClientRect().height);
      setTimeout(() => {
        setOverflow(true);
      }, 200);
    } else {
      setOverflow(false);
      setHeight(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (ref.current) {
      const ro = new ResizeObserver((entries) => {
        if (!isOpen) {
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
  }, [ref, isOpen]);

  return (
    <div>
      <div
        className={clsx(
          "overflow-hidden duration-200",
          overflow && "overflow-visible",
          Boolean(isChildrenChangeRef.current) && "duration-0",
        )}
        style={{ height, ...(style || {}) }}
      >
        <div ref={ref}>{isOpen ? children : null}</div>
      </div>
      <div
        className={clsx(
          "xl:hidden flex items-center gap-2 text-main-primary cursor-pointer py-2 text-16 font-semibold",
          isOpen && "mt-2 xl:mt-4",
        )}
        onClick={() => setOpen(!open)}
      >
        <p>{isOpen ? "Show less" : "Show more"}</p>
        <Svg
          iconName="chevron-down"
          size={24}
          className={clsx("duration-200", isOpen && "rotate-180")}
        />
      </div>
    </div>
  );
}
