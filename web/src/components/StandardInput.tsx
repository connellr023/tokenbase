import styles from "@/styles/components/StandardInput.module.scss";
import React from "react";
import { merriweather500 } from "@/utils/fonts";

type StandardInputProps = {
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
};

const StandardInput: React.FC<StandardInputProps> = ({ placeholder, type }) => {
  return (
    <input
      className={`${styles.main} ${merriweather500.className}`}
      type={type}
      placeholder={placeholder}
    />
  );
};

export default StandardInput;
