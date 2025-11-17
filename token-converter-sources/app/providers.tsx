"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type State } from "@wagmi/core";
import { PropsWithChildren, useState } from "react";
import { WagmiProvider } from "wagmi";

import DialogsProvider from "@/app/providers/DialogsProvider";
import ToastProvider from "@/app/providers/ToastProvider";
import { config } from "@/config/wagmi.config";

export default function Providers({
  initialState,
  children,
}: PropsWithChildren<{ initialState: State | undefined }>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <DialogsProvider>{children}</DialogsProvider>
        </ToastProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
