import styles from "@/styles/components/NavBar.module.scss";
import ButtonColor from "@/models/ButtonColor";
import StandardLink from "./StandardLink";
import IconButton from "./IconButton";
import TitleDropdown from "./TitleDropdown";
import { useRouter } from "next/router";
import { useRightDrawerContext } from "@/contexts/RightDrawerContext";
import { useModelsContext } from "@/contexts/ModelsContext";
import { useConversationRecordsContext } from "@/contexts/ConversationRecordsContext";
import { useBearerContext } from "@/contexts/BearerContext";
import { useChatRecordsContext } from "@/contexts/ChatRecordsContext";
import { backendEndpoint } from "@/utils/constants";
import {
  faAnglesLeft,
  faArrowLeft,
  faBolt,
  faEdit,
  faSignIn,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";

const deleteConversationEndpoint =
  backendEndpoint + "api/user/conversation/delete";

const NavBar: React.FC = () => {
  const { pathname } = useRouter();
  const { availableModels, setSelectedModel } = useModelsContext();
  const { openDrawer } = useRightDrawerContext();
  const { clearChats } = useChatRecordsContext();
  const { bearer } = useBearerContext();
  const {
    conversationRecords,
    selectedConversationIndex,
    setConversationRecords,
    unselectConversation,
  } = useConversationRecordsContext();

  const deleteCurrentConversation = useCallback(async () => {
    if (
      bearer?.token === undefined ||
      conversationRecords === null ||
      selectedConversationIndex === null
    ) {
      return;
    }

    try {
      const conversationToDelete =
        conversationRecords[selectedConversationIndex];

      const res = await fetch(deleteConversationEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer.token}`,
        },
        body: JSON.stringify({ conversationId: conversationToDelete.id }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete conversation");
      }

      // If the conversation is deleted, remove it from the records.
      clearChats();
      unselectConversation();
      setConversationRecords(
        conversationRecords.filter(
          (_, index) => index !== selectedConversationIndex
        )
      );
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  }, [
    bearer?.token,
    conversationRecords,
    selectedConversationIndex,
    clearChats,
    unselectConversation,
    setConversationRecords,
  ]);

  return (
    <nav className={styles.container}>
      {/* Render model selection */}
      {pathname === "/" && (
        <TitleDropdown
          items={availableModels.map((model, i) => {
            const split = model.tag.split(":");
            return {
              text: `${split[0]} (${split[1]})`,
              onSelect: () => setSelectedModel(i),
            };
          })}
        />
      )}

      <div className={styles.linksContainer}>
        {/* Render navigation back to main chat page */}
        {pathname !== "/" && (
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
      </div>

      {/* Render current conversations information */}
      {selectedConversationIndex !== null &&
        conversationRecords !== null &&
        pathname === "/" && (
          <div className={styles.conversationInfo}>
            <TitleDropdown
              title={conversationRecords[selectedConversationIndex].name}
              items={[
                { icon: faEdit, text: "Rename" },
                {
                  icon: faTrash,
                  text: "Delete",
                  color: ButtonColor.Red,
                  onSelect: deleteCurrentConversation,
                },
              ]}
            />
          </div>
        )}

      {/* Render logo */}
      <div className={styles.logo}>
        <b>
          <i>tokenbase</i>
        </b>
        {pathname === "/" && (
          <IconButton icon={faAnglesLeft} onClick={openDrawer}>
            Open
          </IconButton>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
