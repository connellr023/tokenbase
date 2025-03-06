import styles from "@/styles/components/Home.module.scss";
import ChatContainer from "@/components/ChatContainer";
import { backendEndpoint } from "@/utils/constants";
import { useRef } from "react";
import { reqNewGuestSession } from "@/utils/reqNewGuestSession";

const guestPromptEndpoint = backendEndpoint + "api/chat/guest/prompt";

const Home: React.FC = () => {
  const guestSessionId = useRef<string | null>(null);

  const setGuestSession = async () => {
    if (!guestSessionId.current) {
      const id = await reqNewGuestSession();

      if (!id) {
        return "Failed to create guest session";
      }

      guestSessionId.current = id;
    }
  };

  const constructGuestRequest = (prompt: string) => {
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

  return (
    <>
      <div className={styles.container}>
        <ChatContainer
          endpoint={guestPromptEndpoint}
          constructRequest={constructGuestRequest}
          onSend={setGuestSession}
        />
      </div>
    </>
  );
};

export default Home;
