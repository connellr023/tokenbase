import styles from "@/styles/components/Chat.module.scss";
import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import IconButton from "./IconButton";

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
      <p className={styles.prompt}>{prompt}</p>
      {replyTokens.length > 0 && (
        <p className={styles.reply}>
          {replyTokens.map((token, index) => (
            <span key={index} className={!isComplete ? "fade-in" : ""}>
              {token}
            </span>
          ))}
        </p>
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
