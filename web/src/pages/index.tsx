import styles from "@/styles/Home.module.scss";
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

      // Alert for now...
      if (!id) {
        alert("Failed to create guest session");
        return;
      }

      guestSessionId.current = id;
    }
  };

  const constructGuestRequest = (prompt: string) => {
    return {
      guestSessionId: guestSessionId.current ?? "",
      prompt,
    };
  };

  return (
    <>
      <div className={styles.container}>
        <h2>Welcome</h2>
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
