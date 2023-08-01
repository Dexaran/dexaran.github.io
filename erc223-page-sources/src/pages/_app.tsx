import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { Manrope } from 'next/font/google'
import clsx from "clsx";
import {SnackbarProvider} from "../providers/SnackbarProvider";

const manrope = Manrope({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return <SnackbarProvider>
    <div className={clsx(manrope.className, "wrapper")}>
      <Component {...pageProps} />
    </div>
  </SnackbarProvider>
}
