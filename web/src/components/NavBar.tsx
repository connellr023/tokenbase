import styles from "@/styles/components/NavBar.module.scss";
import StandardButton from "./StandardButton";
import { faBolt, faSignIn } from "@fortawesome/free-solid-svg-icons";

const NavBar: React.FC = () => {
  return (
    <nav className={styles.container}>
      <StandardButton icon={faBolt} onClick={() => {}}>
        Register
      </StandardButton>
      <StandardButton icon={faSignIn} onClick={() => {}}>
        Log In
      </StandardButton>
    </nav>
  );
};

export default NavBar;
