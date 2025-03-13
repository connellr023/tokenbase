import styles from "@/styles/components/NavBar.module.scss";
import { useRouter } from "next/router";
import StandardButton from "./StandardButton";
import { faBolt, faSignIn, faStar } from "@fortawesome/free-solid-svg-icons";

const NavBar: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <nav className={styles.container}>
      <div className={styles.buttonContainer}>
        {/* Render navigation back to main chat page */}
        {pathname !== "/" && (
          <StandardButton icon={faStar} onClick={() => router.push("/")}>
            Chat
          </StandardButton>
        )}

        {/* Render navigation button back to register page */}
        {(pathname === "/" || pathname === "/login") && (
          <StandardButton
            icon={faBolt}
            onClick={() => router.push("/register")}
          >
            Register
          </StandardButton>
        )}

        {/* Render navigation button back to login page */}
        {(pathname === "/" || pathname === "/register") && (
          <StandardButton icon={faSignIn} onClick={() => router.push("/login")}>
            Log In
          </StandardButton>
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
