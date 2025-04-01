import styles from "@/styles/components/Chat.module.scss";
import ButtonColor from "@/models/ButtonColor";
import IconButton from "./IconButton";
import TypesetRenderer from "./TypesetRenderer";
import TypeCursor from "./TypeCursor";
import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type ChatProps = {
  createdAt: number;
  prompt: string;
  reply: string;
  isComplete: boolean;
  onDelete?: (createdAt: number) => void;
};

const Chat: React.FC<ChatProps> = ({
  createdAt,
  prompt,
  reply,
  isComplete,
  onDelete,
}) => {
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  const handleCopy = () => {
    navigator.clipboard.writeText(reply);
    setCopyButtonText("Copied!");
  };

  const handleMouseLeave = () => {
    setCopyButtonText("Copy");
  };

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
          <IconButton
            icon={faCopy}
            onClick={handleCopy}
            onMouseLeave={handleMouseLeave}
          >
            {copyButtonText}
          </IconButton>
          <IconButton
            icon={faTrash}
            color={ButtonColor.Red}
            onClick={() => onDelete?.(createdAt)}
          >
            Delete
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default Chat;
