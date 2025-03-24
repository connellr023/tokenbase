import styles from "@/styles/components/StandardTextArea.module.scss";
import React, { useState, useEffect } from "react";
import { merriweather500 } from "@/utils/fonts";

type StandardTAProps = {
  placeholder: string;
  value?: string;
  isValid?: () => boolean;
  max: number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const StandardTextArea: React.FC<StandardTAProps> = ({
  placeholder,
  value,
  isValid,
  max,
  onChange,
}) => {

  max = max < 1? 10: max;

  const [hasError, setError] = useState(false);
  const [textValue, setValue] = useState("");
  const [charCount, setCount] = useState(max);


//   useEffect(() => {
//     if (isValid !== undefined) {
//       setError(!isValid() && value !== undefined && value !== "");
//     } else {
//       setError(value !== undefined && value !== "");
//     }
//   }, [value, isValid]);

   const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    setCount(max-event.target.value.length);
    onChange;
  };

  return (
    <>
        <textarea
          className={`${styles.main} ${merriweather500.className} ${
          hasError ? styles.error : ""
          }`}
          maxLength={max}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
        <p>Characters remaining: {charCount}</p>
    </>
  );
};

export default StandardTextArea;
