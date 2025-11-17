import { useEffect, useState } from "react";

export default function useDetectMetaMaskMobile() {
  const [isMetaMaskMobile, setIsMetaMaskMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || "";
    const isMetaMaskMobileApp = /MetaMaskMobile/i.test(userAgent);
    const hasEthereum = typeof window.ethereum !== "undefined";

    if (isMetaMaskMobileApp && hasEthereum) {
      setIsMetaMaskMobile(true);
    }
  }, []);

  return isMetaMaskMobile;
}
