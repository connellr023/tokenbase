import "@/styles/globals.scss";
import Head from "next/head";
import { merriweather400 } from "@/utils/fonts";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>tokenbase</title>
        <meta
          name="description"
          content="A modular, AI-powered assistant platform that provides real-time chat, role-based access, and conversation tracking, designed for self-hosted or small organizational deployments. "
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/logo_transparent.svg" /> */}
      </Head>
      <main className={merriweather400.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default App;
