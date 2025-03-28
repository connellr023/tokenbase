import styles from "@/styles/components/IconButton.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export enum IconButtonColor {
  Red,
}

type IconButtonProps = {
  icon: IconProp;
  color?: IconButtonColor;
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
  let colorClassName = "";

  if (color !== undefined) {
    switch (color) {
      case IconButtonColor.Red:
        colorClassName = styles.red;
        break;
    }
  }

  return (
    <div className={`${styles.container} ${colorClassName}`}>
      <button onClick={onClick} onMouseLeave={onMouseLeave}>
        <FontAwesomeIcon icon={icon} />
      </button>
      {children && <label>{children}</label>}
    </div>
  );
};

export default IconButton;
