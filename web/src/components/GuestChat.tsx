import styles from "@/styles/components/GuestChat.module.scss";
import ChatContainer from "@/components/ChatContainer";
import Modal from "@/components/Modal";
import StandardButton from "@/components/StandardButton";
import router from "next/router";
import { backendEndpoint } from "@/utils/constants";
import { reqNewGuestSession } from "@/utils/reqNewGuestSession";
import { useHomeModalContext } from "@/contexts/HomeModalContext";
import { useBearerContext } from "@/contexts/BearerContext";
import { useModelsContext } from "@/contexts/ModelsContext";
import {
  faArrowRight,
  faBolt,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";

const guestPromptEndpoint = backendEndpoint + "api/guest/chat/prompt";
const guestDeleteChatEndpoint = backendEndpoint + "api/guest/chat/delete";

type GuestChatProps = {
  chatSuggestions: string[];
};

const GuestChat: React.FC<GuestChatProps> = ({ chatSuggestions }) => {
  const { isOpen, close } = useHomeModalContext();
  const { bearer, setBearer } = useBearerContext();
  const { availableModels, selectedModelIndex } = useModelsContext();

  const constructGuestPromptRequest = async (prompt: string, images: string[]) => {
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
          images,
          model: availableModels[selectedModelIndex].tag,
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

        setBearer({ token });

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

  const constructGuestDeleteChatRequest = async (createdAt: number) => {
    return {
      ok: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer?.token}`,
        },
        body: JSON.stringify({
          createdAt,
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
      <ChatContainer
        promptEndpoint={guestPromptEndpoint}
        deleteEndpoint={guestDeleteChatEndpoint}
        suggestions={chatSuggestions}
        constructPromptRequest={constructGuestPromptRequest}
        constructDeleteRequest={constructGuestDeleteChatRequest}
      />
    </>
  );
};

export default GuestChat;
