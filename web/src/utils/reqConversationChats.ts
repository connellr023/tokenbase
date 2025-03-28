import ChatRecord from "@/models/ChatRecord";
import { backendEndpoint } from "./constants";

type ConversationChatsResponse = {
  chats: ChatRecord[];
};

export const reqConversationChats = async (conversationId: string) => {
  try {
    const result = await fetch(
      `${backendEndpoint}api/user/chat/all/${conversationId}`,
      {
        method: "GET",
      }
    );

    if (!result.ok) {
      return null;
    }

    const data: ConversationChatsResponse = await result.json();
    return data.chats;
  } catch {
    return null;
  }
};
