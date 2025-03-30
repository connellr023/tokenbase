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
      <button className={merriweather400.className}>
        <i>{children}</i>
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
    </div>
  );
};

export default TitleDropdown;
