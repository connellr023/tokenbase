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
  label?: string;
  onClick: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  className,
  color,
  label,
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
    <div className={styles.container}>
      <button className={`${colorClassName} ${className}`} onClick={onClick}>
        <FontAwesomeIcon icon={icon} />
      </button>
      {label && <label>{label}</label>}
    </div>
  );
};

export default IconButton;
