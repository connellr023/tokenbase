import Conversation from "@/models/Conversation";
import { backendEndpoint } from "./constants";

const newConversationEndpoint = backendEndpoint + "api/user/conversation/new";

type NewConversationRequest = {
  model: string;
  firstPrompt: string;
};

type NewConversationResponse = {
  conversation: Conversation;
};

export const reqNewConversation = async (
  model: string,
  firstPrompt: string,
  jwt?: string
) => {
  try {
    const res = await fetch(newConversationEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        model,
        firstPrompt,
      } as NewConversationRequest),
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as NewConversationResponse;
    return data.conversation;
  } catch {
    return null;
  }
};
