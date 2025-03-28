import ChatContainer from "./ChatContainer";
import { useBearerContext } from "@/contexts/BearerContext";
import { useConversationRecordsContext } from "@/contexts/ConversationRecordsContext";
import { useModelsContext } from "@/contexts/ModelsContext";
import { backendEndpoint } from "@/utils/constants";
import { reqNewConversation } from "@/utils/reqNewConversation";
import { useEffect } from "react";
import { reqAllConversations } from "@/utils/reqAllConversations";

const userPromptEndpoint = backendEndpoint + "api/user/chat/prompt";
const userDeleteChatEndpoint = backendEndpoint + "api/user/chat/delete";

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
  const { bearer } = useBearerContext();

  if (!bearer?.user) {
    throw new Error("User not authenticated");
  }

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
        availableModels[selectedModelIndex].tag ?? "",
        prompt,
        bearer.token
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
    if (conversationRecords === null) {
      return {
        error: "Cannot delete chat without conversation records",
      };
    }

    return { error: "Not implemented" };
  };

  useEffect(() => {
    const getAllConversations = async () => {
      const conversations = await reqAllConversations(bearer.token);
      setConversationRecords(conversations);
    };

    getAllConversations();
  }, [bearer]);

  return (
    <ChatContainer
      promptEndpoint={userPromptEndpoint}
      deleteEndpoint={userDeleteChatEndpoint}
      suggestions={chatSuggestions}
      constructPromptRequest={constructUserPromptRequest}
      constructDeleteRequest={constructUserDeleteChatRequest}
    />
  );
};

export default UserChat;
