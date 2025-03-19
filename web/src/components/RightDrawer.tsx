import styles from "@/styles/components/RightDrawer.module.scss";
import { useRightDrawerContext } from "@/contexts/RightDrawerContext";

const RightDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer } = useRightDrawerContext();

  return (
    <div
      className={`${styles.container} ${!isDrawerOpen ? styles.closed : ""}`}
    >
      <button onClick={closeDrawer}>Close Drawer</button>
    </div>
  );
};

export default RightDrawer;
