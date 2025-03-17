import "@/styles/globals.scss";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import App, { AppContext, AppProps } from "next/app";
import { merriweather400 } from "@/utils/fonts";
import { HomeModalProvider } from "@/contexts/HomeModalContext";
import { BearerProvider } from "@/contexts/BearerContext";
import { ChatRecordsProvider } from "@/contexts/ChatRecordsContext";
import { backendEndpoint } from "@/utils/constants";
import { ModelsProvider } from "@/contexts/ModelsContext";

const modelsEndpoint = backendEndpoint + "api/models";

type RootAppProps = AppProps & {
  availableModels: string[];
};

class RootApp extends App<RootAppProps> {
  static async getInitialProps(appContext: AppContext) {
    const appProps = await App.getInitialProps(appContext);

    // Fetch all models
    let availableModels = [];

    try {
      const modelsRes = await fetch(modelsEndpoint);

      if (modelsRes.ok) {
        availableModels = await modelsRes.json();
      }
    } catch {}

    return { ...appProps, availableModels };
  }

  render() {
    const { Component, pageProps, availableModels } = this.props;

    return (
      <>
        <Head>
          <title>tokenbase</title>
          <meta
            name="description"
            content="A modular, AI-powered assistant platform that provides real-time chat, role-based access, and conversation tracking, designed for self-hosted or small organizational deployments."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* <link rel="icon" href="/logo_transparent.svg" /> */}
        </Head>
        <ModelsProvider availableModels={availableModels}>
          <HomeModalProvider>
            <BearerProvider>
              <ChatRecordsProvider>
                <NavBar />
                <main className={merriweather400.className}>
                  <Component {...pageProps} />
                </main>
              </ChatRecordsProvider>
            </BearerProvider>
          </HomeModalProvider>
        </ModelsProvider>
      </>
    );
  }
}

export default RootApp;
