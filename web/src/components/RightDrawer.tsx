import styles from "@/styles/components/RightDrawer.module.scss";
import IconButton from "./IconButton";
import StandardButton from "./StandardButton";
import { Url } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/router";
import { useRightDrawerContext } from "@/contexts/RightDrawerContext";
import { useBearerContext } from "@/contexts/BearerContext";
import { useConversationRecordsContext } from "@/contexts/ConversationRecordsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firaMono400, merriweather400 } from "@/utils/fonts";
import {
  faAnglesRight,
  faBolt,
  faBoxOpen,
  faPlus,
  faShieldAlt,
  faSignIn,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { useChatRecordsContext } from "@/contexts/ChatRecordsContext";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";

const RightDrawer: React.FC = () => {
  const { push } = useRouter();
  const { isDrawerOpen, closeDrawer } = useRightDrawerContext();
  const { bearer, clearBearer } = useBearerContext();
  const { clearChats } = useChatRecordsContext();
  const {
    conversationRecords,
    clearConversationRecords,
    selectedConversationIndex,
    selectConversation,
    unselectConversation,
  } = useConversationRecordsContext();

  const pushAndClose = async (path: Url) => {
    await push(path);
    closeDrawer();
  };

  const logout = () => {
    closeDrawer();
    clearBearer();
    clearChats();
    clearConversationRecords();
    unselectConversation();
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

        <div>
          {/* Render message for guests */}
          {!bearer?.user ? (
            <div className={styles.noConversationHistoryContainer}>
              <div>
                <FontAwesomeIcon icon={faShieldAlt} size="3x" />
              </div>
              <p>
                Please <b>login</b> or <b>register</b> for the ability to manage
                multiple conversations.
              </p>
            </div>
          ) : (
            <>
              {conversationRecords !== null ? (
                <>
                  {conversationRecords.length === 0 ? (
                    <div className={styles.noConversationHistoryContainer}>
                      <div>
                        <FontAwesomeIcon icon={faBoxOpen} size="3x" />
                      </div>
                      <p>
                        You have no conversation history. New conversations will
                        appear here once you start chatting.
                      </p>
                    </div>
                  ) : (
                    <ul className={styles.conversationHistoryContainer}>
                      {conversationRecords.map((record, i) => (
                        <li key={i}>
                          <button
                            className={merriweather400.className}
                            onClick={() => selectConversation(i)}
                            key={i}
                          >
                            {record.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <div className={styles.noConversationHistoryContainer}>
                  <div>
                    <FontAwesomeIcon icon={faBox} size="3x" />
                  </div>
                  <p>
                    An error occurred while fetching your conversation history.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Render footer area */}
          <div className={styles.containerFooter}>
            {/* Render login button for guests */}
            {!bearer?.user ? (
              <>
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
              </>
            ) : (
              <>
                <div className={styles.profileContainer}>
                  <span
                    className={`${styles.profileIcon} ${firaMono400.className}`}
                  >
                    {(bearer.user.username ?? "?")[0].toUpperCase()}
                  </span>
                  <span className={styles.email}>
                    {bearer.user.email ?? "None"}
                  </span>
                </div>
                <StandardButton
                  isDisabled={selectedConversationIndex === null}
                  icon={faPlus}
                  onClick={unselectConversation}
                >
                  New Conversation
                </StandardButton>
                <StandardButton icon={faSignOut} onClick={logout}>
                  Logout
                </StandardButton>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RightDrawer;
