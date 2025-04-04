import styles from "@/styles/components/PromptArea.module.scss";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { merriweather400, merriweather500 } from "@/utils/fonts";
import {
  faArrowUp,
  faPaperclip,
  faStop,
} from "@fortawesome/free-solid-svg-icons";

type PromptAreaProps = {
  isDisabled: boolean;
  canCancel: boolean;
  canAttach: boolean;
  onSend: (prompt: string, promptImages: string[]) => void;
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
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = () => {
    onSend(prompt.trim(), attachedImages);
    setAttachedImages([]);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const uploadedImages: string[] = [];

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const target = event.target;

          if (target === null) {
            return;
          }

          uploadedImages.push(target.result as string);
          setAttachedImages((prev) => [...prev, target.result as string]);
        };

        reader.readAsDataURL(file);
      });
    }

    // Reset the file input
    e.target.value = "";
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
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          rows={1}
          spellCheck={false}
        />
        <div className={styles.buttonContainer}>
          <button type="button" disabled={isDisabled || !canAttach}>
            {attachedImages.length > 0 && (
              <span
                className={`${styles.imageCount} ${merriweather400.className}`}
              >
                {Math.min(attachedImages.length, 99)}
              </span>
            )}
            <FontAwesomeIcon icon={faPaperclip} />
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
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
