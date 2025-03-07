import styles from "@/styles/components/Home.module.scss";
import ChatContainer from "@/components/ChatContainer";
import { backendEndpoint } from "@/utils/constants";
import { useRef } from "react";
import { reqNewGuestSession } from "@/utils/reqNewGuestSession";

const guestPromptEndpoint = backendEndpoint + "api/guest/chat/prompt";
const guestDeleteChatEndpoint = backendEndpoint + "api/guest/chat/delete";

const Home: React.FC = () => {
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
      <div className={styles.container}>
        <ChatContainer
          promptEndpoint={guestPromptEndpoint}
          deleteEndpoint={guestDeleteChatEndpoint}
          constructPromptRequest={constructGuestPromptRequest}
          constructDeleteRequest={constructGuestDeleteChatRequest}
          onSend={setGuestSession}
        />
      </div>
    </>
  );
};

export default Home;
