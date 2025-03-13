import "@/styles/globals.scss";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import { merriweather400 } from "@/utils/fonts";
import type { AppProps } from "next/app";
import { HomeModalProvider } from "@/contexts/HomeModalContext";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
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
      <NavBar />
      <main className={merriweather400.className}>
        <HomeModalProvider>
          <Component {...pageProps} />
        </HomeModalProvider>
      </main>
    </>
  );
};

export default App;
