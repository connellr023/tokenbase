import styles from "@/styles/components/GuestChat.module.scss";
import ChatContainer from "./ChatContainer";
import { useBearerContext } from "@/contexts/BearerContext";
import { useConversationRecordsContext } from "@/contexts/ConversationRecordsContext";
import { useModelsContext } from "@/contexts/ModelsContext";
import { useHomeModalContext } from "@/contexts/HomeModalContext";
import { backendEndpoint } from "@/utils/constants";
import { reqNewConversation } from "@/utils/reqNewConversation";
import { useEffect, useState } from "react";
import { reqAllConversations } from "@/utils/reqAllConversations";
import Modal from "./Modal";
import StandardInput from "./StandardInput";
import StandardButton from "./StandardButton";
import ErrorMessage from "./ErrorMessage";
import {
  faArrowLeft,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const userPromptEndpoint = backendEndpoint + "api/user/chat/prompt";
const userDeleteChatEndpoint = backendEndpoint + "api/user/chat/delete";
const renameConversationEndpoint = backendEndpoint + "api/user/conversation/rename";

type UserChatProps = {
  chatSuggestions: string[];
};

const UserChat: React.FC<UserChatProps> = ({ chatSuggestions }) => {
  const {
    selectedConversationIndex,
    conversationRecords,
    selectConversation,
    setConversationRecords,
  } = useConversationRecordsContext();
  const { availableModels, selectedModelIndex } = useModelsContext();
  const {
    isRenameModalOpen,
    closeRenameModal,
    renameConversationId,
  } = useHomeModalContext();
  const { bearer } = useBearerContext();
  const [ newName, setNewName ] = useState("");
  const [error, setError] = useState<string | null>(null);  

  if (!bearer?.user) {
    throw new Error("Bearer token is not available");
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!(newName.trim() === "")) {
        handleRename();
      }
    }
  };

  const constructUserPromptRequest = async (prompt: string) => {
    if (conversationRecords === null) {
      return {
        error: "Cannot create prompt request without conversation records",
      };
    }

    const constructReq = (conversationId: string) => {
      if (availableModels.length === 0) {
        return {
          error: "No models available",
        };
      }

      return {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer.token}`,
        },
        body: JSON.stringify({
          prompt,
          model: availableModels[selectedModelIndex].tag,
          conversationId,
        }),
      };
    };

    // If there is no selected conversation, we want to start a new one
    if (selectedConversationIndex === null) {
      const newConversation = await reqNewConversation(
        availableModels[selectedModelIndex].tag,
        prompt,
        bearer.token,
      );

      if (!newConversation) {
        return { error: "Failed to start conversation" };
      }

      // Add the new conversation to the conversation records
      setConversationRecords([newConversation, ...conversationRecords]);
      selectConversation(0);

      return { ok: constructReq(newConversation.id) };
    } else {
      // There is already a selected conversation
      const currentConversation =
        conversationRecords[selectedConversationIndex];

      return { ok: constructReq(currentConversation.id) };
    }
  };

  const constructUserDeleteChatRequest = async (createdAt: number) => {
    if (conversationRecords === null || selectedConversationIndex === null) {
      return {
        error: "Cannot delete chat without conversation records and selection",
      };
    }

    return {
      ok: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer.token}`,
        },
        body: JSON.stringify({
          conversationId: conversationRecords[selectedConversationIndex].id,
          createdAt,
        }),
      },
    };
  };

  const handleRename = async () => {
    if (!renameConversationId || newName.trim() === "") return;

    try {
      const res = await fetch(renameConversationEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer.token}`,
        },
        body: JSON.stringify({
          conversationId: renameConversationId,
          name: newName,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to rename conversation");
      }

      const data = await res.json();
      const updatedRecords = conversationRecords
        ? conversationRecords.map((conversation) =>
            conversation.id === renameConversationId
              ? { ...conversation, name: data.conversation.name }
              : conversation,
          )
        : [];
      setConversationRecords(updatedRecords);
      closeRenameModal();
      setNewName("");
    } catch (err) {
      console.error("Error renaming conversation:", err);
      setError((err instanceof Error ? err.message : "An unexpected error occurred. Please try again."));
    }
  }

  useEffect(() => {
    // Fetch all conversations when the component mounts
    (async () => {
      const conversations = await reqAllConversations(bearer.token);
      setConversationRecords(conversations);
    })();
  }, [bearer.token, setConversationRecords]);

  return (
    <>
      <Modal isOpen={isRenameModalOpen} onClickOutside={closeRenameModal}>
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
            isDisabled={(newName.trim() === "")}
          >
            Rename
          </StandardButton>
          <StandardButton
            icon={faArrowLeft}
            onClick={closeRenameModal}
          >
            Cancel
          </StandardButton>
        </div>
        {error && (
          <div className={styles.errorContainer}>
            <ErrorMessage error={error} />
          </div>
        )}
      </Modal>
      <ChatContainer
        promptEndpoint={userPromptEndpoint}
        deleteEndpoint={userDeleteChatEndpoint}
        suggestions={chatSuggestions}
        constructPromptRequest={constructUserPromptRequest}
        constructDeleteRequest={constructUserDeleteChatRequest}
      />
    </>
  );
};

export default UserChat;
