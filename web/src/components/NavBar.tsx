import styles from "@/styles/components/NavBar.module.scss";
import StandardDropdown from "./StandardDropdown";
import StandardLink from "./StandardLink";
import { useRouter } from "next/router";
import {
  faArrowLeft,
  faBolt,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";
import { useModelsContext } from "@/contexts/ModelsContext";

const NavBar: React.FC = () => {
  const { pathname } = useRouter();
  const { availableModels, setSelectedIndex } = useModelsContext();

  return (
    <nav className={styles.container}>
      <div className={styles.buttonContainer}>
        {/* Render model selection */}
        {pathname === "/" && (
          <StandardDropdown
            items={availableModels.map((name, i) => ({
              label: name.split(":")[0],
              onClick: () => setSelectedIndex(i),
            }))}
          />
        )}

        {/* Render navigation back to main chat page */}
        {pathname !== "/" && (
          <StandardLink icon={faArrowLeft} label="Chat" href="/" />
        )}

        {/* Render navigation button back to register page */}
        {(pathname === "/" || pathname === "/login") && (
          <StandardLink icon={faBolt} label="Register" href="/register" />
        )}

        {/* Render navigation button back to login page */}
        {(pathname === "/" || pathname === "/register") && (
          <StandardLink icon={faSignIn} label="Login" href="/login" />
        )}
      </div>

      {/* Render logo */}
      <b className={styles.logo}>
        <i>tokenbase</i>
      </b>
    </nav>
  );
};

export default NavBar;
