import styles from "@/styles/components/IconButton.module.scss";
import ButtonColor, { ButtonColorToClassName } from "@/models/ButtonColor";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type IconButtonProps = {
  icon: IconProp;
  color?: ButtonColor;
  children?: string;
  onClick: () => void;
  onMouseLeave?: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  color,
  children,
  onClick,
  onMouseLeave,
}) => {
  return (
    <div
      className={`${styles.container} ${ButtonColorToClassName(styles, color)}`}
    >
      <button onClick={onClick} onMouseLeave={onMouseLeave}>
        <FontAwesomeIcon icon={icon} />
      </button>
      {children && <label>{children}</label>}
    </div>
  );
};

export default IconButton;
