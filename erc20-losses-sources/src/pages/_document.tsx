import { Head, Html, Main, NextScript } from "next/document";

import { basePath } from "@/constants/build-config/isProd";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="shortcut icon" href={`${basePath}/static/favicon.ico`} />
      </Head>

      <body>
        <Main />
        <div id="drawer-root" />
        <div id="dialog-root" />

        <NextScript />
      </body>
    </Html>
  );
}
