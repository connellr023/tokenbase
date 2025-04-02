import styles from "@/styles/components/NavBar.module.scss";
import ButtonColor from "@/models/ButtonColor";
import StandardLink from "./StandardLink";
import IconButton from "./IconButton";
import TitleDropdown from "./TitleDropdown";
import { useRouter } from "next/router";
import { useRightDrawerContext } from "@/contexts/RightDrawerContext";
import { useModelsContext } from "@/contexts/ModelsContext";
import { useHomeModalContext } from "@/contexts/HomeModalContext";
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
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";
import Modal from "./Modal";
import StandardInput from "./StandardInput";
import StandardButton from "./StandardButton";
import ErrorMessage from "./ErrorMessage";

const deleteConversationEndpoint =
  backendEndpoint + "api/user/conversation/delete";

const renameConversationEndpoint =
  backendEndpoint + "api/user/conversation/rename";

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

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // Modal open state
  const [renameConversationId, setRenameConversationId] = useState<
    string | null
  >(null); // ID of the conversation being renamed
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const openModal = (conversationId: string) => {
    setRenameConversationId(conversationId);
    setIsRenameModalOpen(true);
  };

  const closeModal = () => {
    setRenameConversationId(null);
    setIsRenameModalOpen(false);
    setError(null); // Clear any previous errors
    setNewName(""); // Reset the input field
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!(newName.trim() === "")) {
        handleRename();
      }
    }
  };

  const handleRename = useCallback(async () => {
    if (
      bearer?.token === undefined ||
      conversationRecords === null ||
      selectedConversationIndex === null ||
      newName.trim() === ""
    ) {
      return;
    }

    try {
      const res = await fetch(renameConversationEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer.token}`,
        },
        body: JSON.stringify({
          conversationId: conversationRecords[selectedConversationIndex]?.id,
          name: newName,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to rename conversation");
      }

      const data = await res.json();
      const updatedRecords = conversationRecords
        ? conversationRecords.map((conversation) =>
            conversation.id ===
            conversationRecords[selectedConversationIndex]?.id
              ? {
                  ...conversation,
                  name: data.conversation.name,
                  updated_at: data.conversation.updated_at,
                }
              : conversation,
          )
        : [];
      updatedRecords.sort((a, b) => b.createdAt - a.createdAt);
      setConversationRecords(updatedRecords);
      closeModal();
      setNewName("");
    } catch (err) {
      console.error("Error renaming conversation:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.",
      );
    }
  }, [
    bearer?.token,
    conversationRecords,
    selectedConversationIndex,
    newName,
    renameConversationEndpoint,
    renameConversationId,
    setConversationRecords,
    closeModal,
    setNewName,
    setError,
  ]);

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
          (_, index) => index !== selectedConversationIndex,
        ),
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
    <>
      <Modal isOpen={isRenameModalOpen} onClickOutside={closeModal}>
        <h2 className={styles.modalTitle}>Rename Conversation</h2>
        <StandardInput
          type="text"
          placeholder="Enter new name"
          value={newName}
          isValid={() => !(newName.trim() === "")}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <div className={styles.modalButtonContainer}>
          <StandardButton
            icon={faCheck}
            onClick={handleRename}
            isDisabled={newName.trim() === ""}
          >
            Rename
          </StandardButton>
          <StandardButton icon={faArrowLeft} onClick={closeModal}>
            Cancel
          </StandardButton>
        </div>
        {error && (
          <div className={styles.errorContainer}>
            <ErrorMessage error={error} />
          </div>
        )}
      </Modal>
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
                  {
                    icon: faEdit,
                    text: "Rename",
                    onSelect: () =>
                      openModal(
                        conversationRecords[selectedConversationIndex].id,
                      ),
                  },
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
    </>
  );
};

export default NavBar;
