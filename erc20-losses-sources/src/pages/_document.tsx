import { Head, Html, Main, NextScript } from "next/document";

import { basePath } from "@/constants/build-config/isProd";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href={`${basePath}/static/favicon.ico`} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
