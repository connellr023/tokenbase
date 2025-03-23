import "@/styles/globals.scss";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import ModelInfo from "@/models/ModelInfo";
import RightDrawer from "@/components/RightDrawer";
import App, { AppContext, AppProps } from "next/app";
import { merriweather400 } from "@/utils/fonts";
import { HomeModalProvider } from "@/contexts/HomeModalContext";
import { BearerProvider } from "@/contexts/BearerContext";
import { ChatRecordsProvider } from "@/contexts/ChatRecordsContext";
import { ModelsProvider } from "@/contexts/ModelsContext";
import { getAvailableModels } from "@/utils/getAvailableModels";
import { RightDrawerProvider } from "@/contexts/RightDrawerContext";
import { ConversationRecordsProvider } from "@/contexts/ConversationRecordsContext";

type RootAppProps = AppProps & {
  availableModels: ModelInfo[];
};

class RootApp extends App<RootAppProps> {
  static async getInitialProps(appContext: AppContext) {
    const appProps = await App.getInitialProps(appContext);

    return {
      ...appProps,
      availableModels: await getAvailableModels(),
    };
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
          <link rel="icon" href="/logo.svg" />
        </Head>
        <ModelsProvider availableModels={availableModels}>
          <HomeModalProvider>
            <BearerProvider>
              <ConversationRecordsProvider>
                <ChatRecordsProvider>
                  <RightDrawerProvider>
                    <NavBar />
                    <RightDrawer />
                    <main className={merriweather400.className}>
                      <Component {...pageProps} />
                    </main>
                  </RightDrawerProvider>
                </ChatRecordsProvider>
              </ConversationRecordsProvider>
            </BearerProvider>
          </HomeModalProvider>
        </ModelsProvider>
      </>
    );
  }
}

export default RootApp;
