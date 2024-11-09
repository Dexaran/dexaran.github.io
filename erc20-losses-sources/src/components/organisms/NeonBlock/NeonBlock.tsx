import clsx from "clsx";
import React, { useMemo, useRef } from "react";

import OverlineText from "@/components/atoms/OverlineText";
import Svg from "@/components/atoms/Svg";
import { IconName } from "@/constants/IconName";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useIsMobile } from "@/hooks/useIsMobile";

import styles from "./NeonBlock.module.scss";

interface Props {
  icon: IconName;
  color: "green" | "blue" | "purple" | "red";
  overlineText: string;
  leftContent: any;
  rightContent?: any;
  differentColumns?: boolean;
  anchor?: string;
  onlyBottom?: boolean;
  noAnimation?: boolean;
  withoutTopLine?: boolean;
}

export default function NeonBlock({
  icon,
  color,
  overlineText,
  leftContent,
  rightContent,
  differentColumns = false,
  anchor,
  onlyBottom = false,
  noAnimation = false,
  withoutTopLine = false,
}: Props) {
  const isMobile = useIsMobile();

  const ref = useRef();
  const entryTopLine = useIntersectionObserver(ref, { threshold: 0 });
  const entryBottomLine = useIntersectionObserver(ref, { threshold: 0.5 });

  const isBottomVisible = useMemo(() => {
    if (!entryBottomLine) {
      return false;
    }
    return (
      entryBottomLine.boundingClientRect.bottom < window.innerHeight &&
      entryBottomLine.boundingClientRect.bottom > 0
    );
  }, [entryBottomLine]);

  return (
    <div className="container_internal">
      <div
        className={clsx(
          styles.neonBlockContainer,
          styles[color],
          differentColumns && styles.different,
          onlyBottom && styles.onlyBottom,
          withoutTopLine && styles.withoutTopLine,
        )}
      >
        <div className={clsx(styles.neonLineWrapper, styles.neonTopLineCell)}>
          <div
            className={clsx(
              styles.neonTopLine,
              (entryTopLine?.isIntersecting || noAnimation || isMobile) && styles.animate,
            )}
          />
          {anchor && <span className={styles.anchor} id={anchor} />}
        </div>
        <div
          className={clsx(
            styles.neonLineWrapper,
            styles.neonIconCell,
            (entryBottomLine?.isIntersecting || isBottomVisible || noAnimation || isMobile) &&
              styles.animate,
          )}
        >
          <div className={styles.neonIcon}>
            <Svg iconName={icon} layout="cover" />
          </div>
        </div>
        <div className={clsx(styles.overlineTextContainer, styles.headingCell)}>
          <OverlineText text={overlineText} color={color} />
        </div>
        <div ref={ref} className={clsx(styles.neonLineWrapper, styles.neonBottomLineCell)}>
          <div
            className={clsx(
              styles.neonBottomLine,
              (entryBottomLine?.isIntersecting || isBottomVisible || noAnimation || isMobile) &&
                styles.animate,
            )}
          />
        </div>
        <div className={styles.leftContent}>{leftContent}</div>
        <div className={styles.rightContent}>{rightContent}</div>
      </div>
    </div>
  );
}
