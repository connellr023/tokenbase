import styles from "@/styles/components/TextareaForm.module.scss";
import StandardButton from "./StandardButton";
import React, { useState } from "react";
import { merriweather500 } from "@/utils/fonts";
import { faSync } from "@fortawesome/free-solid-svg-icons";

type TextareaFormProps = {
  placeholder: string;
  value?: string;
  max: number;
  header?: string;
  desc?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: () => void;
};

const TextareaForm: React.FC<TextareaFormProps> = ({
  placeholder,
  value,
  max,
  header,
  desc,
  onChange,
  onSubmit,
}) => {
  const [charsLeft, setCharsLeft] = useState(max);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharsLeft(max - event.target.value.length);
    onChange;
  };

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
          />
          <p className={styles.count}>{charsLeft}</p>
        </div>
        <StandardButton
          icon={faSync}
          isDisabled={charsLeft >= max}
          onClick={() => onSubmit}
        >
          Update
        </StandardButton>
      </div>
    </div>
  );
};

export default TextareaForm;
