import styles from "@/styles/components/Chat.module.scss";
import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import IconButton from "./IconButton";
import TypesetRenderer from "./TypesetRenderer";

type ChatProps = {
  chatId: number;
  prompt: string;
  replyTokens: string[];
  isComplete: boolean;
};

const Chat: React.FC<ChatProps> = ({
  chatId,
  prompt,
  replyTokens,
  isComplete,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.promptContainer}>
        <TypesetRenderer content={prompt} />
      </div>
      {replyTokens.length > 0 && (
        <div className={styles.replyContainer}>
          <TypesetRenderer content={replyTokens.join("")} />
        </div>
      )}
      {isComplete && (
        <div className={`${styles.chatOptions} fade-in`}>
          <IconButton icon={faCopy} onClick={() => console.log("copy")} />
          <IconButton
            icon={faTrash}
            onClick={() => console.log("delete", chatId)}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
