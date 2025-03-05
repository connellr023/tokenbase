import styles from "@/styles/components/PromptArea.module.scss";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { ubuntu500 } from "@/utils/fonts";

type PromptAreaProps = {
  isDisabled?: boolean;
  onSend: (prompt: string) => void;
};

const PromptArea: React.FC<PromptAreaProps> = ({ isDisabled, onSend }) => {
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
          className={ubuntu500.className}
          ref={textareaRef}
          value={prompt}
          onChange={handleInput}
          placeholder="Ask Anything..."
          rows={1}
          spellCheck={false}
        />
        <button
          onClick={handleSend}
          disabled={isDisabled || prompt.trim().length === 0}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </div>
      <p>
        Note, the <b>LLM</b> used by <b>tokenbase</b> does <i>not</i> produce
        perfect answers.
      </p>
    </div>
  );
};

export default PromptArea;
