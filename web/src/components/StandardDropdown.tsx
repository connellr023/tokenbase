import React, { useState } from "react";
import styles from "@/styles/components/StandardDropdown.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { merriweather400 } from "@/utils/fonts";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

type DropdownItem = {
  icon?: IconProp;
  label: string;
  onClick: () => void;
};

type StandardDropdownProps = {
  items: DropdownItem[];
};

const StandardDropdown: React.FC<StandardDropdownProps> = ({ items }) => {
  if (items.length === 0) {
    throw new Error("Dropdown must have at least one item");
  }

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdown}>
      <button
        className={`${isOpen ? styles.open : ""} ${styles.dropdownToggle} ${
          merriweather400.className
        }`}
        onClick={toggleDropdown}
      >
        <i>{items[0].label}</i>
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {items.map((item, index) => (
            <li
              key={index}
              className={styles.dropdownItem}
              onClick={item.onClick}
            >
              {item.icon && (
                <FontAwesomeIcon icon={item.icon} className={styles.icon} />
              )}
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StandardDropdown;
