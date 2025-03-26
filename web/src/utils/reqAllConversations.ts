import Conversation from "@/models/Conversation";
import { backendEndpoint } from "./constants";

const getAllConversationsEndpoint =
  backendEndpoint + "api/user/conversation/all";

type AllConversationsResponse = {
  conversations: Conversation[];
};

export const reqAllConversations = async (
  jwt?: string,
): Promise<Conversation[] | null> => {
  try {
    const response = await fetch(getAllConversationsEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as AllConversationsResponse;
    return data.conversations;
  } catch {
    return null;
  }
};
