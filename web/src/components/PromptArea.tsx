import styles from "@/styles/components/PromptArea.module.scss";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faSquare } from "@fortawesome/free-solid-svg-icons";
import { merriweather500 } from "@/utils/fonts";

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
    resetHeight();
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    resetHeight();
  };

  useEffect(() => resetHeight(), [prompt]);

  return (
    <div className={styles.container}>
      <div>
        <textarea
          className={merriweather500.className}
          ref={textareaRef}
          value={prompt}
          onChange={handleInput}
          placeholder="Ask Anything..."
          rows={1}
          spellCheck={false}
        />
        {canCancel ? (
          <button onClick={onCancel}>
            <FontAwesomeIcon icon={faSquare} />
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
      <p>
        Note, the <b>LLM</b> used does <b>not</b> produce perfect answers.
      </p>
    </div>
  );
};

export default PromptArea;
