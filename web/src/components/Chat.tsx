import styles from "@/styles/components/Chat.module.scss";
import IconButton, { IconButtonColor } from "./IconButton";
import TypesetRenderer from "./TypesetRenderer";
import TypeCursor from "./TypeCursor";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faPaperclip,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

type ChatProps = {
  createdAt: number;
  prompt: string;
  images: string[];
  reply: string;
  isComplete: boolean;
  onDelete?: (createdAt: number) => void;
};

const Chat: React.FC<ChatProps> = ({
  createdAt,
  prompt,
  images,
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
        {images.length > 0 && (
          <div className={styles.imageCount}>
            <FontAwesomeIcon icon={faPaperclip} />
            {images.length}
          </div>
        )}
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
            color={IconButtonColor.Red}
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
