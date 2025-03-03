import "@/styles/globals.scss";
import Head from "next/head";
import type { AppProps } from "next/app";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  weight: "500",
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>TokenBase</title>
        <meta
          name="description"
          content="A modular, AI-powered assistant platform that provides real-time chat, role-based access, and conversation tracking, designed for self-hosted or small organizational deployments. "
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo_transparent.svg" />
      </Head>
      <main className={ubuntu.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default App;
