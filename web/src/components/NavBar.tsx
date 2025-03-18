import styles from "@/styles/components/NavBar.module.scss";
import StandardDropdown from "./StandardDropdown";
import StandardLink from "./StandardLink";
import IconButton from "./IconButton";
import { useRouter } from "next/router";
import { useModelsContext } from "@/contexts/ModelsContext";
import {
  faAnglesLeft,
  faArrowLeft,
  faBolt,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";

const NavBar: React.FC = () => {
  const { pathname } = useRouter();
  const { availableModels, setSelectedIndex } = useModelsContext();

  return (
    <nav className={styles.container}>
      {/* Render model selection */}
      {pathname === "/" && (
        <StandardDropdown
          items={availableModels.map((model) => {
            const split = model.tag.split(":");
            return `${split[0]} (${split[1]})`;
          })}
          onSelect={setSelectedIndex}
        />
      )}

      <div className={styles.buttonsContainer}>
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
      <div className={styles.logo}>
        <b>
          <i>tokenbase</i>
        </b>
        <IconButton icon={faAnglesLeft} label="Open" onClick={() => {}} />
      </div>
    </nav>
  );
};

export default NavBar;
