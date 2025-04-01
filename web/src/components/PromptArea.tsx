import styles from "@/styles/components/PromptArea.module.scss";
import { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { merriweather500 } from "@/utils/fonts";
import {
  faArrowUp,
  faPaperclip,
  faStop,
} from "@fortawesome/free-solid-svg-icons";

type PromptAreaProps = {
  isDisabled: boolean;
  canCancel: boolean;
  canAttach: boolean;
  onSend: (prompt: string) => void;
  onCancel: () => void;
};

const PromptArea: React.FC<PromptAreaProps> = ({
  isDisabled,
  canCancel,
  canAttach,
  onSend,
  onCancel,
}) => {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = () => {
    onSend(prompt.trim());
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim().length > 0 && !isDisabled) {
        handleSend();
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [prompt, adjustTextareaHeight]);

  useEffect(() => {
    window.addEventListener("resize", adjustTextareaHeight);

    return () => {
      window.removeEventListener("resize", adjustTextareaHeight);
    };
  }, [adjustTextareaHeight]);

  return (
    <div className={styles.container}>
      <div>
        <textarea
          className={merriweather500.className}
          ref={textareaRef}
          value={prompt}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          rows={1}
          spellCheck={false}
        />
        <div className={styles.buttonContainer}>
          <button disabled={isDisabled || !canAttach}>
            <FontAwesomeIcon icon={faPaperclip} />
          </button>
          {canCancel ? (
            <button onClick={onCancel}>
              <FontAwesomeIcon icon={faStop} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={isDisabled || prompt.trim().length === 0}
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptArea;
