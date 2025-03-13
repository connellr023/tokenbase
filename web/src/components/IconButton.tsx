import styles from "@/styles/components/IconButton.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export enum IconButtonColor {
  Red,
}

type IconButtonProps = {
  icon: IconProp;
  className?: string;
  color?: IconButtonColor;
  onClick: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  className,
  color,
  onClick,
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
    <button
      className={`${styles.iconButton} ${colorClassName} ${className}`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default IconButton;
