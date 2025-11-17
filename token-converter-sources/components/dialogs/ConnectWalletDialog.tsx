import { useSwitchChain } from "wagmi";

import { networks } from "@/config/networks.config";
import {
  useConnectWalletDialogStateStore,
  useConnectWalletStore,
} from "@/stores/useConnectWalletStore";

import DialogHeader from "../atoms/DialogHeader";
import DrawerDialog from "../atoms/DrawerDialog";
import PickButton from "../atoms/PickButton";
import CoinbaseCard from "../cards/CoinbaseCard";
import KeystoreCard from "../cards/KeystoreCard";
import MetamaskCard from "../cards/MetamaskCard";
import SafePalCard from "../cards/SafePalCard";
import WalletConnectCard from "../cards/WalletConnectCard";

function StepLabel({ step, label }: { step: string; label: string }) {
  return (
    <div className="flex gap-3 items-center">
      <span className="w-10 h-10 text-18 rounded-full bg-tertiary-bg flex items-center justify-center">
        {step}
      </span>
      <span className="text-18 text-secondary-text font-medium">{label}</span>
    </div>
  );
}

export default function ConnectWalletDialog() {
  const { isOpened: isOpenedWallet, setIsOpened: setOpenedWallet } =
    useConnectWalletDialogStateStore();

  const { chainToConnect, setChainToConnect } = useConnectWalletStore();
  const { switchChain } = useSwitchChain();

  return (
    <DrawerDialog isOpen={isOpenedWallet} setIsOpen={setOpenedWallet}>
      <div className="w-full md:w-[600px]">
        <DialogHeader onClose={() => setOpenedWallet(false)} title="Connect wallet" />
        <div className="card-spacing">
          <StepLabel step="1" label="Choose network" />
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3 mb-5">
            {networks.map(({ name, chainId, logo }) => {
              return (
                <PickButton
                  key={chainId}
                  isActive={chainId === chainToConnect}
                  onClick={() => {
                    setChainToConnect(chainId);
                    if (switchChain) {
                      switchChain({ chainId });
                    }
                  }}
                  image={logo}
                  label={name}
                />
              );
            })}
          </div>
          <StepLabel step="2" label="Choose wallet" />
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
            <MetamaskCard />
            <WalletConnectCard />
            <CoinbaseCard />
            <SafePalCard />
            <KeystoreCard />
          </div>
        </div>
      </div>
    </DrawerDialog>
  );
}
