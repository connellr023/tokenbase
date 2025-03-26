import { useBearerContext } from "@/contexts/BearerContext";
import ChatContainer from "./ChatContainer";
import { useConversationRecordsContext } from "@/contexts/ConversationRecordsContext";
import { useModelsContext } from "@/contexts/ModelsContext";
import { backendEndpoint } from "@/utils/constants";
import { reqNewConversation } from "@/utils/reqNewConversation";

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

  const constructUserPromptRequest = async (prompt: string) => {
    // If there is no selected conversation, we want to start a new one
    if (selectedConversationIndex === null) {
      const newConversation = await reqNewConversation(
        availableModels[selectedModelIndex].tag ?? "",
        prompt,
        bearer?.token
      );

      if (!newConversation) {
        return { error: "Failed to start conversation" };
      }

      // Add the new conversation to the conversation records
      setConversationRecords([newConversation, ...(conversationRecords ?? [])]);
      selectConversation(0);

      console.log(newConversation);
    }

    return { error: "Not implemented" };
  };

  const constructUserDeleteChatRequest = async (chatId: number) => {
    return { error: "Not implemented" };
  };

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
