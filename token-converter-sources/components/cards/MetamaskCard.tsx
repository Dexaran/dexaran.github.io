import { usePathname } from "next/navigation";
import { isMobile } from "react-device-detect";
import { useAccount, useConnect, useSwitchChain } from "wagmi";

import { wallets } from "@/config/wallets.config";
import useDetectMetaMaskMobile from "@/hooks/useMetamaskMobile";
import usePreloaderTimeout from "@/hooks/usePreloader";
import {
  useConnectWalletDialogStateStore,
  useConnectWalletStore,
} from "@/stores/useConnectWalletStore";
import addToast from "@/utils/addToast";

import PickButton from "../atoms/PickButton";

const { image, name } = wallets.metamask;
export default function MetamaskCard() {
  const { connectors, connectAsync, isPending } = useConnect();
  const { isConnecting } = useAccount();
  const { setName, chainToConnect } = useConnectWalletStore();
  const { setIsOpened } = useConnectWalletDialogStateStore();
  const isMetamaskMobile = useDetectMetaMaskMobile();

  const { switchChainAsync } = useSwitchChain();

  const loading = usePreloaderTimeout({ isLoading: isPending });

  const pathname = usePathname();

  if (isMobile && !isMetamaskMobile) {
    return (
      <a href={`https://metamask.app.link/dapp/${window.location.host || "test-app.dex223.io"}`}>
        <PickButton disabled={isConnecting} image={image} label={name} loading={loading} />
      </a>
    );
  }

  return (
    <PickButton
      disabled={isConnecting}
      onClick={async () => {
        setName("metamask");
        console.log(connectors[2]);
        const connectorToConnect = connectors[2];

        console.log(connectorToConnect);
        if (!connectorToConnect) {
          return addToast("Install metamask", "error");
        }

        try {
          await connectAsync({
            connector: connectorToConnect,
          });
          await switchChainAsync({ chainId: chainToConnect });
          setIsOpened(false);
          addToast("Successfully connected!");
        } catch (e: any) {
          // console.log(e);
          if (e.code && e.code === 4001) {
            addToast("User rejected the request", "error");
          } else {
            console.log(e);
            addToast("Something went wrong, please contact support", "error");
          }
        }
      }}
      image={image}
      label={name}
      loading={loading}
    />
  );
}
