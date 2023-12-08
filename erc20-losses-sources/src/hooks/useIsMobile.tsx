import { useCallback, useLayoutEffect, useState } from "react";
import debounce from "lodash.debounce";

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(true);

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
