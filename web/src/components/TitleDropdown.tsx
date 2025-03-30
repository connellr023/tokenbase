import styles from "@/styles/components/TitleDropdown.module.scss";
import { merriweather400 } from "@/utils/fonts";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

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
      <h3 className={merriweather400.className}>{children}</h3>
    </div>
  );
};

export default TitleDropdown;
