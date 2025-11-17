import { useState } from "react";
import { useAccount } from "wagmi";

import { wallets } from "@/config/wallets.config";

import PickButton from "../atoms/PickButton";

const { image, name } = wallets.keystore;
export default function KeystoreCard() {
  const [isOpenKeystore, setIsOpenKeystore] = useState(false);

  const { isConnecting } = useAccount();

  return (
    <>
      <PickButton
        disabled={isConnecting}
        onClick={() => setIsOpenKeystore(true)}
        image={image}
        label={name}
        loading={isOpenKeystore}
      />

      {/*<KeystoreConnectDialog isOpen={isOpenKeystore} setIsOpen={setIsOpenKeystore} />*/}
    </>
  );
}
