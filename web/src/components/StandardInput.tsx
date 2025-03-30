import styles from "@/styles/components/StandardInput.module.scss";
import React, { useState, useEffect } from "react";
import { merriweather500 } from "@/utils/fonts";

type StandardInputProps = {
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  isValid?: () => boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const StandardInput: React.FC<StandardInputProps> = ({
  placeholder,
  type,
  value,
  isValid,
  onChange,
  onKeyDown,
}) => {
  const [hasError, setError] = useState(false);

  useEffect(() => {
    if (isValid !== undefined) {
      setError(!isValid() && value !== undefined && value !== "");
    } else {
      setError(value !== undefined && value !== "");
    }
  }, [value, isValid]);

  return (
    <input
      className={`${styles.main} ${merriweather500.className} ${
        hasError ? styles.error : ""
      }`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
};

export default StandardInput;
