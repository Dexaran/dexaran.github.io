import { useAccount, useConnect } from "wagmi";

import { wallets } from "@/config/wallets.config";
import usePreloaderTimeout from "@/hooks/usePreloader";
import {
  useConnectWalletDialogStateStore,
  useConnectWalletStore,
} from "@/stores/useConnectWalletStore";
import addToast from "@/utils/addToast";

import PickButton from "../atoms/PickButton";

const { image, name } = wallets.safePal;
export default function SafePalCard() {
  const { connectors, connectAsync, isPending } = useConnect();
  const { isConnecting } = useAccount();
  const { setName, chainToConnect } = useConnectWalletStore();
  const { setIsOpened } = useConnectWalletDialogStateStore();

  const loading = usePreloaderTimeout({ isLoading: isPending });

  console.log(connectors);
  return (
    <PickButton
      disabled={isConnecting}
      onClick={() => {
        setName("coinbase");
        const connectorToConnect = connectors[4];

        if (!connectorToConnect) {
          return addToast("Install SafePal before proceeding", "error");
        }

        connectAsync({
          connector: connectorToConnect,
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
