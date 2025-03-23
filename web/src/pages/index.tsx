import styles from "@/styles/pages/Home.module.scss";
import React from "react";
import ChatContainer from "@/components/ChatContainer";
import Modal from "@/components/Modal";
import StandardButton from "@/components/StandardButton";
import router from "next/router";
import { backendEndpoint } from "@/utils/constants";
import { reqNewGuestSession } from "@/utils/reqNewGuestSession";
import { GetServerSideProps } from "next";
import { getChatSuggestions } from "@/utils/getChatSuggestions";
import { useHomeModalContext } from "@/contexts/HomeModalContext";
import { useBearerContext } from "@/contexts/BearerContext";
import { useModelsContext } from "@/contexts/ModelsContext";
import { UserVariant } from "@/models/User";
import {
  faArrowRight,
  faBolt,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";

const guestPromptEndpoint = backendEndpoint + "api/guest/chat/prompt";
const guestDeleteChatEndpoint = backendEndpoint + "api/guest/chat/delete";

type HomeProps = {
  chatSuggestions: string[];
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  return {
    props: {
      chatSuggestions: await getChatSuggestions(),
    },
  };
};

const Home: React.FC<HomeProps> = ({ chatSuggestions }) => {
  const { isOpen, close } = useHomeModalContext();
  const { bearer, setBearer } = useBearerContext();
  const { availableModels, selectedIndex } = useModelsContext();

  React.useEffect(() => {
    setBearer({
      variant: UserVariant.User,
      token: "dsoifjiodswjifod",
      data: {
        id: 1,
        email: "johndoe@gmail.com",
        username: "Johnathan Dover",
      },
    });
  }, []);

  const constructGuestPromptRequest = async (prompt: string) => {
    const constructReq = (token: string) => {
      if (availableModels.length === 0) {
        return {
          error: "No models available",
        };
      }

      return {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          model: availableModels[selectedIndex].tag,
        }),
      };
    };

    if (!bearer) {
      try {
        const token = await reqNewGuestSession();

        if (!token) {
          return {
            error: "Failed to create guest session",
          };
        }

        setBearer({
          variant: UserVariant.Guest,
          token,
        });

        return {
          ok: constructReq(token),
        };
      } catch {
        return {
          error: "Failed to request for guest session",
        };
      }
    }

    return { ok: constructReq(bearer.token) };
  };

  const constructGuestDeleteChatRequest = async (chatId: number) => {
    return {
      ok: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer?.token}`,
        },
        body: JSON.stringify({
          chatId,
        }),
      },
    };
  };

  return (
    <>
      <Modal isOpen={isOpen} onClickOutside={close}>
        <h1 className={styles.modalTitle}>Welcome.</h1>
        <div className={styles.modalButtonContainer}>
          <StandardButton icon={faSignIn} onClick={() => router.push("/login")}>
            Login
          </StandardButton>
          <StandardButton
            icon={faBolt}
            onClick={() => router.push("/register")}
          >
            Register
          </StandardButton>
          <StandardButton icon={faArrowRight} onClick={close}>
            Continue as guest
          </StandardButton>
        </div>
      </Modal>
      <div className={styles.container}>
        <ChatContainer
          promptEndpoint={guestPromptEndpoint}
          deleteEndpoint={guestDeleteChatEndpoint}
          suggestions={chatSuggestions}
          constructPromptRequest={constructGuestPromptRequest}
          constructDeleteRequest={constructGuestDeleteChatRequest}
        />
      </div>
    </>
  );
};

export default Home;
