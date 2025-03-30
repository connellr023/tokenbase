import styles from "@/styles/components/TitleDropdown.module.scss";
import { useEffect, useRef, useState } from "react";
import { merriweather400 } from "@/utils/fonts";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

type TitleDropdownProps = {
  children: string;
  items: [IconDefinition | null, string][];
  onSelect: (index: number) => void;
};

const TitleDropdown: React.FC<TitleDropdownProps> = ({
  children,
  items,
  onSelect,
}: TitleDropdownProps) => {
  const [isHidden, setHidden] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setHidden((prev) => !prev);
  };

  const handleSelect = (index: number) => {
    onSelect(index);
    setSelectedIndex(index);
    setHidden(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setHidden(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={`${styles.dropdownButton} ${
          !isHidden ? styles.active : ""
        } ${merriweather400.className}`}
        onClick={toggleDropdown}
      >
        <i>{children}</i>
        {isHidden ? (
          <FontAwesomeIcon icon={faChevronDown} />
        ) : (
          <FontAwesomeIcon icon={faChevronUp} />
        )}
      </button>
      {!isHidden && (
        <div className={`${styles.dropdown}`}>
          {items.map(([icon, text], index) => (
            <button
              key={index}
              className={merriweather400.className}
              onClick={() => handleSelect(index)}
            >
              {icon && <FontAwesomeIcon icon={icon} />}
              {text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TitleDropdown;
