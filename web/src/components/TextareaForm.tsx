import styles from "@/styles/components/TextareaForm.module.scss";
import StandardButton from "./StandardButton";
import ErrorMessage from "./ErrorMessage";
import React, { useCallback, useEffect, useState } from "react";
import { merriweather500 } from "@/utils/fonts";
import { faSync } from "@fortawesome/free-solid-svg-icons";

type TextareaFormProps = {
  placeholder: string;
  value: string;
  max: number;
  header: string;
  desc: string;
  isDisabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => Promise<string | void>;
  onKeyDown?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const TextareaForm: React.FC<TextareaFormProps> = ({
  placeholder,
  value,
  max,
  header,
  desc,
  isDisabled,
  onChange,
  onSubmit,
}) => {
  const [charsLeft, setCharsLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value && value.trim().length > 0 && !(charsLeft >= max)) {
        onSubmit?.();
      }
    }
  };

  const handleSubmit = useCallback(async () => {
    setError(null);

    const error = await onSubmit();

    if (error) {
      setError(error);
    }
  }, [onSubmit]);

  useEffect(() => {
    setCharsLeft(max - value.length);
  }, [max, value]);

  return (
    <div className={styles.container}>
      <div className={styles.div1}>
        <h1>{header}</h1>
        <p className={styles.desc}>{desc}</p>
        <div className={styles.div2}>
          <textarea
            spellCheck={false}
            className={`${styles.main} ${merriweather500.className}`}
            maxLength={max}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            disabled={isDisabled}
            onKeyDown={handleKeyDown}
          />
          <p className={styles.count}>{charsLeft}</p>
        </div>
        <StandardButton
          icon={faSync}
          isDisabled={charsLeft >= max || isDisabled}
          onClick={handleSubmit}
        >
          Update
        </StandardButton>
        {error && (
          <div className={styles.errorContainer}>
            <ErrorMessage error={error} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextareaForm;
