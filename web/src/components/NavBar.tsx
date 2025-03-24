import styles from "@/styles/components/NavBar.module.scss";
import StandardDropdown from "./StandardDropdown";
import StandardLink from "./StandardLink";
import IconButton from "./IconButton";
import { useRouter } from "next/router";
import { useRightDrawerContext } from "@/contexts/RightDrawerContext";
import { useModelsContext } from "@/contexts/ModelsContext";
import {
  faAnglesLeft,
  faArrowLeft,
  faBolt,
  faSignIn,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

const NavBar: React.FC = () => {
  const { pathname } = useRouter();
  const { availableModels, setSelectedIndex } = useModelsContext();
  const { openDrawer } = useRightDrawerContext();

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
        {pathname !== "/" && pathname !== "/admin" && (
          <StandardLink icon={faArrowLeft} href="/">
            Chat
          </StandardLink>
        )}

        {/* Render navigation button back to register page */}
        {pathname === "/login" && (
          <StandardLink icon={faBolt} href="/register">
            Register
          </StandardLink>
        )}

        {/* Render navigation button back to login page */}
        {pathname === "/register" && (
          <StandardLink icon={faSignIn} href="/login">
            Login
          </StandardLink>
        )}

        {/* Render navigation button back to login page */}
        {pathname === "/admin" && (
          <StandardLink icon={faSignOut} href="/">
            Logout
          </StandardLink>
        )}
      </div>

      {/* Render logo */}
      <div className={styles.logo}>
        <b>
          <i>tokenbase</i>
        </b>
        {pathname == "/" && (
          <IconButton icon={faAnglesLeft} onClick={openDrawer}>
            Open
          </IconButton>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
