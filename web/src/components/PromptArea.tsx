import styles from "@/styles/components/PromptArea.module.scss";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

type PromptAreaProps = {
  onSend: (prompt: string) => void;
};

const PromptArea: React.FC<PromptAreaProps> = ({ onSend }) => {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = () => {
    onSend(prompt);
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
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={handleInput}
        placeholder="Ask Anything..."
        rows={1}
        spellCheck={false}
      />
      <button onClick={handleSend}>
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </div>
  );
};

export default PromptArea;
