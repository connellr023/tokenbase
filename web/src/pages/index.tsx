import styles from "@/styles/pages/Home.module.scss";
import ChatContainer from "@/components/ChatContainer";
import Modal from "@/components/Modal";
import StandardButton from "@/components/StandardButton";
import router from "next/router";
import { backendEndpoint } from "@/utils/constants";
import { useRef } from "react";
import { reqNewGuestSession } from "@/utils/reqNewGuestSession";
import { GetServerSideProps } from "next";
import { getChatSuggestions } from "@/utils/getChatSuggestions";
import { useHomeModal } from "@/contexts/HomeModalContext";
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
  const { isOpen, close } = useHomeModal();
  const guestSessionId = useRef<string | null>(null);

  const setGuestSession = async () => {
    if (!guestSessionId.current) {
      try {
        const id = await reqNewGuestSession();

        if (!id) {
          return "Failed to create guest session";
        }

        guestSessionId.current = id;
      } catch {
        return "Failed to request for guest session";
      }
    }
  };

  const constructGuestPromptRequest = (prompt: string) => {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${guestSessionId.current ?? ""}`,
      },
      body: JSON.stringify({
        prompt,
      }),
    };
  };

  const constructGuestDeleteChatRequest = (chatId: number) => {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${guestSessionId.current ?? ""}`,
      },
      body: JSON.stringify({
        chatId,
      }),
    };
  };

  return (
    <>
      <Modal isOpen={isOpen}>
        <h2 className={styles.modalTitle}>
          <i>tokenbase</i>
        </h2>
        <div className={styles.modalButtonContainer}>
          <StandardButton
            icon={faBolt}
            onClick={() => router.push("/register")}
          >
            Register
          </StandardButton>
          <StandardButton icon={faSignIn} onClick={() => router.push("/login")}>
            Login
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
          onSend={setGuestSession}
        />
      </div>
    </>
  );
};

export default Home;
