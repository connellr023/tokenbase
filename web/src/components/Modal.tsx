import styles from "@/styles/components/Modal.module.scss";
import { useCallback, useEffect, useRef } from "react";

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onClickOutside?: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, children, onClickOutside }) => {
  const windowRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        windowRef.current &&
        !windowRef.current.contains(event.target as Node)
      ) {
        onClickOutside?.();
      }
    },
    [onClickOutside],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className={`${styles.container}  ${isOpen ? styles.visible : ""}`}>
      <div className={styles.window} ref={windowRef}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
