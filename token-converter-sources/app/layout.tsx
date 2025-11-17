import "@/app/globals.css";

import clsx from "clsx";
import { Golos_Text } from "next/font/google";
import { PropsWithChildren } from "react";

import Providers from "@/app/providers";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const golos_text = Golos_Text({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning className="h-full">
      <body className={clsx(golos_text.className, "h-full")}>
        <Providers initialState={undefined}>
          <div className="flex flex-col h-full">
            <Header />
            <div className="flex-grow">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

export const metadata = {
  title: "Token Converter",
  description: "Easily convert ERC-20 toket to safer ERC-223 alternative",
};
