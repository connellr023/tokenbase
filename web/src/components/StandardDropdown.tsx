import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/StandardDropdown.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { merriweather400 } from "@/utils/fonts";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

type StandardDropdownProps = {
  items: string[];
  onSelect: (index: number) => void;
  isValid?: (index: number) => boolean;
};

const StandardDropdown: React.FC<StandardDropdownProps> = ({
  items,
  onSelect,
}) => {
  if (items.length === 0) {
    items = ["None"];
  }

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (index: number) => {
    setIsOpen(false);
    setSelectedIndex(index);
    onSelect(index);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={`${isOpen ? styles.open : ""} ${styles.dropdownToggle} ${
          merriweather400.className
        }`}
        onClick={toggleDropdown}
      >
        {items[selectedIndex]}
        {isOpen ? (
          <FontAwesomeIcon icon={faChevronUp} />
        ) : (
          <FontAwesomeIcon icon={faChevronDown} />
        )}
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {items.map((item, i) => (
            <li
              aria-roledescription="menuitem"
              key={i}
              className={`${styles.dropdownItem} ${
                i === selectedIndex ? styles.selected : ""
              }`}
              onClick={() => handleItemClick(i)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StandardDropdown;
