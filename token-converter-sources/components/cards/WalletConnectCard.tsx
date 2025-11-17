import { useAccount, useConnect } from "wagmi";

import { wallets } from "@/config/wallets.config";
import usePreloaderTimeout from "@/hooks/usePreloader";
import {
  useConnectWalletDialogStateStore,
  useConnectWalletStore,
} from "@/stores/useConnectWalletStore";
import addToast from "@/utils/addToast";

import PickButton from "../atoms/PickButton";

const { image, name } = wallets.wc;
export default function WalletConnectCard() {
  const { isConnecting } = useAccount();
  const { connectors, connectAsync, isPending } = useConnect();

  const { walletName, setName, chainToConnect } = useConnectWalletStore();
  const { setIsOpened } = useConnectWalletDialogStateStore();

  const loading = usePreloaderTimeout({ isLoading: walletName === "wc" && isPending });

  return (
    <PickButton
      disabled={isConnecting}
      onClick={() => {
        setName("wc");
        connectAsync({
          connector: connectors[0],
          chainId: chainToConnect,
        })
          .then(() => {
            setIsOpened(false);
            addToast("Successfully connected!");
          })
          .catch((e) => {
            if (e.code && e.code === 4001) {
              addToast("User rejected the request", "error");
            } else {
              console.log(e);
              addToast("Something went wrong, please contact support", "error");
            }
          });
      }}
      image={image}
      label={name}
      loading={loading}
    />
  );
}
