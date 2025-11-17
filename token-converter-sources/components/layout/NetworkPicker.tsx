import Image from "next/image";
import { useMemo, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";

import { networks } from "@/config/networks.config";
import { useConnectWalletStore } from "@/stores/useConnectWalletStore";

import ClientOnly from "../atoms/ClientOnly";
import Popover from "../atoms/Popover";
import SelectButton from "../atoms/SelectButton";
import SelectOption from "../atoms/SelectOption";

export default function NetworkPicker() {
  const [isOpened, setIsOpened] = useState(false);
  const { chainToConnect, setChainToConnect } = useConnectWalletStore();
  const { chainId } = useAccount();
  const currentNetwork = useMemo(() => {
    if (chainId) {
      return networks.find((n) => n.chainId === chainId);
    }
    return networks.find((n) => n.chainId === chainToConnect);
  }, [chainId, chainToConnect]);
  const { switchChainAsync } = useSwitchChain();

  return (
    <ClientOnly>
      <Popover
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        placement="bottom-start"
        trigger={
          <SelectButton
            className="pl-2 pr-1 py-1 xl:py-2 gap-0 md:gap-2 xl:px-3 text-secondary-text"
            isOpen={isOpened}
            onClick={() => setIsOpened(!isOpened)}
          >
            {currentNetwork ? (
              <span className="flex items-center gap-2 xl:min-w-[110px]">
                <Image src={`${currentNetwork?.logo}`} alt="Ethereum" width={24} height={24} />
                <span className="hidden xl:inline">{currentNetwork?.name}</span>
              </span>
            ) : (
              "Unknown network"
            )}
          </SelectButton>
        }
      >
        <div className="py-1 text-16 bg-primary-bg rounded-2 min-w-[280px] shadow-popover shadow-black/70">
          <div>
            {networks.map(({ chainId: _chainId, name, logo }) => {
              return (
                <SelectOption
                  key={_chainId}
                  onClick={async () => {
                    if (!chainId) {
                      setChainToConnect(_chainId);
                    }
                    if (switchChainAsync) {
                      try {
                        await switchChainAsync({ chainId: _chainId });
                      } catch (e) {
                        console.log(e);
                      } finally {
                      }
                    }

                    setIsOpened(false);
                  }}
                  isActive={_chainId === currentNetwork?.chainId}
                >
                  <Image src={logo} alt={name} width={24} height={24} />
                  {name}
                </SelectOption>
              );
            })}
          </div>
        </div>
      </Popover>
    </ClientOnly>
  );
}
