import styles from "@/styles/components/Modal.module.scss";
import StandardButton from "./StandardButton";
import { faClose } from "@fortawesome/free-solid-svg-icons";

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  return (
    <div className={`${styles.container}  ${isOpen ? styles.visible : ""}`}>
      <div className={styles.window}>{children}</div>
    </div>
  );
};

export default Modal;
