import styles from "@/styles/components/RightDrawer.module.scss";
import { useRightDrawerContext } from "@/contexts/RightDrawerContext";
import IconButton from "./IconButton";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";

const RightDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer } = useRightDrawerContext();

  return (
    <>
      <div
        className={`${styles.backdrop} ${isDrawerOpen ? styles.visible : ""}`}
        onClick={closeDrawer}
      ></div>
      <div className={`${styles.container} ${isDrawerOpen ? styles.open : ""}`}>
        <div className={styles.containerHeader}>
          <IconButton
            icon={faAnglesRight}
            label="Close"
            onClick={closeDrawer}
          />
          <b>
            <i>tokenbase</i>
          </b>
        </div>
      </div>
    </>
  );
};

export default RightDrawer;
