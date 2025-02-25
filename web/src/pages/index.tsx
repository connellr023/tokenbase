import ChatArea from "@/components/ChatArea";
import PromptArea from "@/components/PromptArea";
import ChatRecord from "@/models/ChatRecord";
import ChatToken from "@/models/ChatToken";
import { backendEndpoint } from "@/utils/constants";
import { useState } from "react";
import { streamResponse } from "@/utils/streamResponse";

type GuestChatRequest = {
  guestSessionId: number;
  prompt: string;
};

const Index: React.FC = () => {
  const [chats, setChats] = useState<ChatRecord[]>([]);

  const onPromptSend = async (prompt: string) => {
    // Construct the request
    const req: GuestChatRequest = {
      guestSessionId: -1, // For now, we don't have a session id
      prompt,
    };

    // Send the prompt to the backend
    const res = await fetch(backendEndpoint + "api/chat/guest/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });

    // Alert for now...
    if (!res.ok) {
      alert("Failed to send prompt");
      return;
    }

    // Initialize a new chat entry
    let chatId: number | undefined = undefined;

    const newChat: ChatRecord = {
      prompt: req.prompt,
      reply: "",
    };

    // Add the new chat entry to the state
    setChats((prevChats) => [...prevChats, newChat]);

    // Stream the response
    await streamResponse(res, (chunk: ChatToken) => {
      // Update the chat entry with the new token
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.chatId === newChat.chatId || chat.chatId === chatId) {
            // Receive chat ID from the first chunk
            chatId = chunk.chatId;

            return {
              ...chat,
              chatId: chunk.chatId,
              reply: chat.reply + chunk.token,
            };
          }

          return chat;
        })
      );
    });
  };

  return (
    <>
      <h1>TokenBase</h1>
      <div>
        <ChatArea chats={chats} />
        <PromptArea onSend={onPromptSend} />
      </div>
    </>
  );
};

export default Index;
