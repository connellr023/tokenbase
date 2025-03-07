import styles from "@/styles/components/Chat.module.scss";
import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import IconButton from "./IconButton";
import TypesetRenderer from "./TypesetRenderer";
import TypeCursor from "./TypeCursor";

type ChatProps = {
  chatId: number;
  prompt: string;
  reply: string;
  isComplete: boolean;
  onDelete?: (chatId: number) => void;
};

const Chat: React.FC<ChatProps> = ({
  chatId,
  prompt,
  reply,
  isComplete,
  onDelete,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.promptContainer}>
        <TypesetRenderer>{prompt}</TypesetRenderer>
      </div>
      {reply.length > 0 && (
        <div className={styles.replyContainer}>
          <TypesetRenderer>{reply}</TypesetRenderer>
          {!isComplete && <TypeCursor />}
        </div>
      )}
      {isComplete && (
        <div className={`${styles.chatOptions} fade-in`}>
          <IconButton icon={faCopy} onClick={() => console.log("copy")} />
          <IconButton icon={faTrash} onClick={() => onDelete?.(chatId)} />
        </div>
      )}
    </div>
  );
};

export default Chat;
