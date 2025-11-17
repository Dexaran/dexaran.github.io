import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount, useDisconnect } from "wagmi";

import { wallets } from "@/config/wallets.config";
import useCurrentChainId from "@/hooks/useCurrentChainId";
import { useConnectWalletDialogStateStore } from "@/stores/useConnectWalletStore";
import getExplorerLink, { ExplorerLinkType } from "@/utils/getExplorerLink";
import truncateMiddle from "@/utils/truncateMiddle";

import Button, { ButtonSize } from "../atoms/Button";
import Drawer from "../atoms/Drawer";
import ExternalTextLink from "../atoms/ExternalTextLink";
import IconButton, { IconButtonVariant } from "../atoms/IconButton";
import Popover from "../atoms/Popover";
import SelectButton from "../atoms/SelectButton";
import Svg from "../atoms/Svg";

function AccountDialogContent({ setIsOpenedAccount, activeTab, setActiveTab }: any) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const chainId = useCurrentChainId();
  const { connector } = useAccount();

  return (
    <>
      <div className="px-5 md:w-[460px] w-full max-h-[calc(100dvh_-_70px)]">
        <div className="flex justify-between items-center my-3">
          <div className="flex items-center gap-2">
            <Image src={wallets.metamask.image} alt="" width={40} height={40} />
            <div></div>

            <div className="flex gap-1">
              {address && (
                <ExternalTextLink
                  text={`${address.slice(0, 6)}...${address.slice(-4)}`}
                  href={getExplorerLink(ExplorerLinkType.ADDRESS, address, chainId)}
                />
              )}
              <IconButton variant={IconButtonVariant.COPY} text={address || ""} />
            </div>
          </div>
          <button
            onClick={() => {
              setIsOpenedAccount(false);
              disconnect({ connector });
            }}
            className="text-secondary-text flex items-center gap-2 hover:text-green duration-200"
          >
            Disconnect
            <Svg iconName="logout" />
          </button>
        </div>
      </div>
    </>
  );
}

export default function AccountDialog() {
  const { isConnected, address, connector } = useAccount();

  const { setIsOpened: setOpenedWallet } = useConnectWalletDialogStateStore();

  const [activeTab, setActiveTab] = useState(0);

  const _isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const [isOpenedAccount, setIsOpenedAccount] = useState(false);

  const trigger = useMemo(
    () => (
      <SelectButton
        className="py-1 xl:py-2 text-14 xl:text-16 w-full md:w-auto flex items-center justify-center group"
        isOpen={isOpenedAccount}
        onClick={() => setIsOpenedAccount(!isOpenedAccount)}
      >
        <span className="duration-200 flex gap-2 items-center text-secondary-text group-hover:text-primary-text">
          <Svg
            className="duration-200 text-tertiary-text group-hover:text-primary-text"
            iconName="wallet"
          />
          {truncateMiddle(address || "", { charsFromStart: 5, charsFromEnd: 3 })}
        </span>
      </SelectButton>
    ),
    [address, isOpenedAccount],
  );

  const [isInitialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <>
      {isConnected && address ? (
        <>
          {_isMobile ? (
            <>
              {trigger}
              <Drawer placement="bottom" isOpen={isOpenedAccount} setIsOpen={setIsOpenedAccount}>
                <AccountDialogContent
                  setIsOpenedAccount={setIsOpenedAccount}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </Drawer>
            </>
          ) : (
            <div>
              <Popover
                isOpened={isOpenedAccount}
                setIsOpened={setIsOpenedAccount}
                placement={"bottom-end"}
                trigger={trigger}
              >
                <div className="bg-primary-bg rounded-5 border border-secondary-border shadow-popover shadow-black/70">
                  <AccountDialogContent
                    setIsOpenedAccount={setIsOpenedAccount}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                </div>
              </Popover>
            </div>
          )}
        </>
      ) : (
        <div>
          <Button
            size={ButtonSize.MEDIUM}
            tabletSize={ButtonSize.SMALL}
            mobileSize={ButtonSize.SMALL}
            className="rounded-2 md:rounded-2 md:font-normal w-full md:w-auto"
            onClick={() => setOpenedWallet(true)}
          >
            Connect wallet
          </Button>
        </div>
      )}
    </>
  );
}
