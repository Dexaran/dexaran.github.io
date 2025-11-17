"use client";
import { PropsWithChildren } from "react";

import ConnectWalletDialog from "@/components/dialogs/ConnectWalletDialog";

export default function DialogsProvider({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <ConnectWalletDialog />
    </>
  );
}
