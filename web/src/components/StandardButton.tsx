import styles from "@/styles/components/StandardButton.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { merriweather400 } from "@/utils/fonts";

type StandardButtonProps = {
  children: string;
  icon?: IconProp;
  value?: string;
  isDisabled?: boolean;
  onClick: () => void;
};

const StandardButton: React.FC<StandardButtonProps> = ({
  children,
  icon,
  isDisabled,
  onClick,
}) => {
  return (
    <button
      className={`${styles.main} ${merriweather400.className}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      <span>{children}</span>
    </button>
  );
};

export default StandardButton;
