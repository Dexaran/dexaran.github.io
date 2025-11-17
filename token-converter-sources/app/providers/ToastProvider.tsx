import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

export default function ToastProvider({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <Toaster className="w-[380px]" position="bottom-center" />
    </>
  );
}
