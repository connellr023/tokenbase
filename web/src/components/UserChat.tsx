import ChatContainer from "./ChatContainer";
import { backendEndpoint } from "@/utils/constants";

const userPromptEndpoint = backendEndpoint + "api/user/chat/prompt";
const userDeleteChatEndpoint = backendEndpoint + "api/user/chat/delete";

type UserChatProps = {
  chatSuggestions: string[];
};

const UserChat: React.FC<UserChatProps> = ({ chatSuggestions }) => {
  const constructUserPromptRequest = async (prompt: string) => {
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
