import styles from "@/styles/pages/Home.module.scss";
import ChatContainer from "@/components/ChatContainer";
import Modal from "@/components/Modal";
import StandardButton from "@/components/StandardButton";
import router from "next/router";
import { backendEndpoint } from "@/utils/constants";
import { reqNewGuestSession } from "@/utils/reqNewGuestSession";
import { GetServerSideProps } from "next";
import { getChatSuggestions } from "@/utils/getChatSuggestions";
import { useHomeModalContext } from "@/contexts/HomeModalContext";
import { BearerVariant, useBearerContext } from "@/contexts/BearerContext";
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

  const constructGuestPromptRequest = async (prompt: string) => {
    const constructReq = (token: string) => {
      return {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
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
          variant: BearerVariant.Guest,
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
        />
      </div>
    </>
  );
};

export default Home;
