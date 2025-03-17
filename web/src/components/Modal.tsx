import styles from "@/styles/components/Modal.module.scss";
import { useEffect, useRef } from "react";

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onClickOutside?: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, children, onClickOutside }) => {
  const windowRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      windowRef.current &&
      !windowRef.current.contains(event.target as Node)
    ) {
      onClickOutside?.();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`${styles.container}  ${isOpen ? styles.visible : ""}`}>
      <div className={styles.window} ref={windowRef}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
