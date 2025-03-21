import styles from "@/styles/components/StandardInput.module.scss";
import React, { useState, useEffect } from "react";
import { merriweather500 } from "@/utils/fonts";

type StandardInputProps = {
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  isValid?: () => boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


const StandardInput: React.FC<StandardInputProps> = ({
  placeholder,
  type,
  value,
  isValid,
  onChange,
}) => {
  const [hasError, setError] = useState(false);

  useEffect(() => {
    if (isValid) {
      setError(!isValid());
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
    />
  );
};

export default StandardInput;
