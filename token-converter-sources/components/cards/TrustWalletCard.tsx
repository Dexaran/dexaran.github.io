import { useAccount, useConnect } from "wagmi";

import { wallets } from "@/config/wallets.config";
import usePreloaderTimeout from "@/hooks/usePreloader";
import {
  useConnectWalletDialogStateStore,
  useConnectWalletStore,
} from "@/stores/useConnectWalletStore";
import addToast from "@/utils/addToast";

import PickButton from "../atoms/PickButton";

const { image, name } = wallets.trustWallet;

export default function TrustWalletCard() {
  const { isConnecting } = useAccount();
  const { connectors, connectAsync, isPending } = useConnect();

  const { setName, chainToConnect } = useConnectWalletStore();
  const { setIsOpened } = useConnectWalletDialogStateStore();

  const loading = usePreloaderTimeout({ isLoading: isPending });

  return (
    <PickButton
      disabled={isConnecting}
      onClick={() => {
        setName("trustWallet");
        const connectorToConnect = connectors[3];

        if (!connectorToConnect) {
          return addToast("Install trust wallet to proceed", "error");
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
