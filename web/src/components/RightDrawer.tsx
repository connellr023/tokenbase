import styles from "@/styles/components/RightDrawer.module.scss";
import IconButton from "./IconButton";
import StandardButton from "./StandardButton";
import { Url } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/router";
import { useRightDrawerContext } from "@/contexts/RightDrawerContext";
import { useBearerContext } from "@/contexts/BearerContext";
import { useConversationRecordsContext } from "@/contexts/ConversationRecordsContext";
import { useChatRecordsContext } from "@/contexts/ChatRecordsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { reqConversationChats } from "@/utils/reqConversationChats";
import { firaMono400, merriweather400 } from "@/utils/fonts";
import {
  faAnglesRight,
  faBolt,
  faBoxOpen,
  faPlus,
  faShieldAlt,
  faSignIn,
  faSignOut,
  faBox,
} from "@fortawesome/free-solid-svg-icons";

const RightDrawer: React.FC = () => {
  const { push } = useRouter();
  const { isDrawerOpen, closeDrawer } = useRightDrawerContext();
  const { bearer, clearBearer } = useBearerContext();
  const { clearChats, setChats } = useChatRecordsContext();
  const {
    conversationRecords,
    clearConversationRecords,
    selectedConversationIndex,
    selectConversation,
    unselectConversation,
  } = useConversationRecordsContext();
  const [isError, setError] = useState(false);

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

  const updateConversationChats = async (conversationIndex: number) => {
    if (conversationIndex === selectedConversationIndex || !bearer?.token) {
      return;
    }

    selectConversation(conversationIndex);
    setError(false);

    const selectedConversation = conversationRecords![conversationIndex];
    const chats = await reqConversationChats(
      bearer.token,
      selectedConversation.id,
    );

    if (chats === null) {
      setError(true);
      return;
    }

    setChats(chats);
  };

  const newConversation = useCallback(() => {
    unselectConversation();
    setChats([]);
  }, [unselectConversation, setChats]);

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
              {conversationRecords !== null && !isError ? (
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
                            className={`${merriweather400.className} ${
                              selectedConversationIndex === i
                                ? styles.selected
                                : ""
                            }`}
                            onClick={() => updateConversationChats(i)}
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
                    Something went wrong while fetching your conversation data.
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
                  onClick={newConversation}
                >
                  New Conversation
                </StandardButton>
                <StandardButton icon={faSignOut} onClick={logout}>
                  Logout
                </StandardButton>
                {bearer.user.isAdmin && (
                  <StandardButton
                    icon={faShieldAlt}
                    onClick={() => pushAndClose("/admin")}
                  >
                    Admin
                  </StandardButton>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RightDrawer;
