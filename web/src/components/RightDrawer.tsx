import styles from "@/styles/components/RightDrawer.module.scss";
import IconButton from "./IconButton";
import StandardButton from "./StandardButton";
import { Url } from "next/dist/shared/lib/router/router";
import { UserVariant } from "@/models/User";
import { useRouter } from "next/router";
import { useRightDrawerContext } from "@/contexts/RightDrawerContext";
import { useBearerContext } from "@/contexts/BearerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faBolt,
  faBoxOpen,
  faShieldAlt,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";

const RightDrawer: React.FC = () => {
  const { push } = useRouter();
  const { isDrawerOpen, closeDrawer } = useRightDrawerContext();
  const { bearer } = useBearerContext();

  const pushAndClose = async (path: Url) => {
    await push(path);
    closeDrawer();
  };

  return (
    <>
      {/* Render transparent backdrop */}
      <div
        className={`${styles.backdrop} ${isDrawerOpen ? styles.visible : ""}`}
        onClick={closeDrawer}
      ></div>

      {/* Render drawer */}
      <div className={`${styles.container} ${isDrawerOpen ? styles.open : ""}`}>
        {/* Render logo header area */}
        <div className={styles.containerHeader}>
          <IconButton icon={faAnglesRight} onClick={closeDrawer}>
            Close
          </IconButton>
          <b>
            <i>tokenbase</i>
          </b>
        </div>

        {/* Render message for guests */}
        {!bearer || bearer.variant === UserVariant.Guest ? (
          <div className={styles.noChatHistoryContainer}>
            <div>
              <FontAwesomeIcon icon={faShieldAlt} size="3x" />
            </div>
            <p>
              Please <b>login</b> or <b>register</b> for the ability to manage
              multiple conversations.
            </p>
          </div>
        ) : (
          <div className={styles.noChatHistoryContainer}>
            <div>
              <FontAwesomeIcon icon={faBoxOpen} size="3x" />
            </div>
            <p>
              You have no chat history. New conversations will appear here once
              you start chatting.
            </p>
          </div>
        )}

        {/* Render footer area */}
        <div className={styles.containerFooter}>
          <StandardButton
            icon={faSignIn}
            onClick={() => pushAndClose("/login")}
          >
            Login
          </StandardButton>
          <StandardButton
            icon={faBolt}
            onClick={() => pushAndClose("/register")}
          >
            Register
          </StandardButton>
        </div>
      </div>
    </>
  );
};

export default RightDrawer;
