import styles from "@/styles/components/IconButton.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type IconButtonProps = {
  icon: IconProp;
  className?: string;
  onClick: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  className,
  onClick,
}) => {
  return (
    <button className={`${styles.iconButton} ${className}`} onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default IconButton;
