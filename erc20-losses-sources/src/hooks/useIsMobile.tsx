import debounce from "lodash.debounce";
import { useCallback, useLayoutEffect, useState } from "react";

export const useIsMobile = (defaultIsMobile: boolean = true): boolean => {
  const [isMobile, setIsMobile] = useState(defaultIsMobile);

  const updateSize = useCallback(() => {
    const is = window.innerWidth < 576;
    setIsMobile(is);
  }, [setIsMobile]);

  useLayoutEffect(() => {
    window.addEventListener("resize", debounce(updateSize, 250));
    updateSize();
    return (): void => window.removeEventListener("resize", updateSize);
  }, [updateSize]);

  return isMobile;
};
