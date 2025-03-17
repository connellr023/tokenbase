import styles from "@/styles/components/Chat.module.scss";
import IconButton, { IconButtonColor } from "./IconButton";
import TypesetRenderer from "./TypesetRenderer";
import TypeCursor from "./TypeCursor";
import { faCopy, faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";

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
          <IconButton icon={faRefresh} onClick={() => console.log("refresh")} />
          <IconButton icon={faCopy} onClick={() => console.log("copy")} />
          <IconButton
            icon={faTrash}
            color={IconButtonColor.Red}
            onClick={() => onDelete?.(chatId)}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
