import styles from "@/styles/components/PromptArea.module.scss";
import { useState, useRef, useEffect } from "react";
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
  onSend: (prompt: string) => void;
  onCancel: () => void;
};

const PromptArea: React.FC<PromptAreaProps> = ({
  isDisabled,
  canCancel,
  onSend,
  onCancel,
}) => {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = () => {
    onSend(prompt.trim());
    setPrompt("");
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [prompt]);

  useEffect(() => {
    window.addEventListener("resize", adjustTextareaHeight);

    return () => {
      window.removeEventListener("resize", adjustTextareaHeight);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <textarea
          className={merriweather500.className}
          ref={textareaRef}
          value={prompt}
          onChange={handleInput}
          placeholder="What's on your mind?"
          rows={1}
          spellCheck={false}
        />
        <div className={styles.buttonContainer}>
          <button disabled={isDisabled}>
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
