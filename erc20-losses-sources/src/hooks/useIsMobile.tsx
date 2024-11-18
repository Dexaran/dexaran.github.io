import debounce from "lodash.debounce";
import { useCallback, useLayoutEffect, useState } from "react";

export const useIsMobile = (
  defaultIsMobile: boolean = true,
): { isMobile: boolean; windowWidth: number } => {
  const [isMobile, setIsMobile] = useState(defaultIsMobile);
  const [windowWidth, setWindowWidth] = useState(0);

  const updateSize = useCallback(() => {
    const is = window.innerWidth < 576;
    setIsMobile(is);
    setWindowWidth(window.innerWidth);
  }, [setIsMobile, setWindowWidth]);

  useLayoutEffect(() => {
    window.addEventListener("resize", debounce(updateSize, 250));
    updateSize();
    return (): void => window.removeEventListener("resize", updateSize);
  }, [updateSize]);

  return { isMobile, windowWidth };
};
