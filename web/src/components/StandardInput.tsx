import styles from "@/styles/components/StandardInput.module.scss";
import React from "react";
import { merriweather500 } from "@/utils/fonts";

type StandardInputProps = {
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const StandardInput: React.FC<StandardInputProps> = ({ placeholder, type, value, onChange }) => {
  return (
    <input
      className={`${styles.main} ${merriweather500.className}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default StandardInput;
