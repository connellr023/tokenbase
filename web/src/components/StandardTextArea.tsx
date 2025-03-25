import styles from "@/styles/components/StandardTextArea.module.scss";
import React, { useState, useEffect } from "react";
import { merriweather500 } from "@/utils/fonts";
import StandardButton from "./StandardButton";
import {
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

type StandardTAProps = {
  placeholder: string;
  value?: string;
  max: number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  header?: string;
  desc?: string;
  onSubmit?: () => void;
};

const StandardTextArea: React.FC<StandardTAProps> = ({
  placeholder,
  value,
  max,
  onChange,
  header,
  desc,
  onSubmit
}) => {

  max = max < 1? 100: max;

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
    setCount(max - event.target.value.length);
    onChange;
  };

  return (
    <div className={styles.div1}>
        <h1>{header}</h1>
        <p>{desc}</p>
        <div className={styles.div2}>
          <textarea
            className={`${styles.main} ${merriweather500.className}`}
            maxLength={max}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
          />
          <p className={styles.count}>{charCount}</p>
          <StandardButton
              icon={faCheck}
              isDisabled={max==0}
              onClick={() => onSubmit}
            >
              Submit
          </StandardButton>
        </div>
    </div>
  );
};

export default StandardTextArea;
