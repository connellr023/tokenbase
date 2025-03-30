import styles from "@/styles/components/TitleDropdown.module.scss";
import { merriweather400 } from "@/utils/fonts";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type TitleDropdownProps = {
  children: string;
  items: [IconDefinition, string][];
  onSelect: (index: number) => void;
};

const TitleDropdown: React.FC<TitleDropdownProps> = ({
  children,
  items,
  onSelect,
}: TitleDropdownProps) => {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.dropdownButton} ${merriweather400.className}`}
      >
        <i>{children}</i>
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
      <div className={styles.dropdown}>
        {items.map(([icon, text], index) => (
          <button
            key={index}
            className={merriweather400.className}
            onClick={() => onSelect(index)}
          >
            <FontAwesomeIcon icon={icon} />
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TitleDropdown;
