import ChatArea from "@/components/ChatArea";
import PromptArea from "@/components/PromptArea";
import ChatRecord from "@/models/ChatRecord";
import ChatToken from "@/models/ChatToken";
import { backendEndpoint } from "@/utils/constants";
import { useState } from "react";
import { recvHttpStream } from "@/utils/recvHttpStream";
import ChatError from "@/models/ChatError";

type GuestChatRequest = {
  guestSessionId: string;
  prompt: string;
};

const Index: React.FC = () => {
  const [chats, setChats] = useState<ChatRecord[]>([]);
  const [streamingChat, setStreamingChat] = useState<ChatRecord | undefined>(
    undefined
  );

  const onPromptSend = async (prompt: string) => {
    // Construct the request
    const req: GuestChatRequest = {
      guestSessionId: "", // For now, we don't have a session id
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
    let newChat: ChatRecord = {
      prompt: prompt,
      reply: "",
    };

    // Stream the response
    await recvHttpStream(res, (chunk: ChatToken & ChatError) => {
      // Check if this chunk is an error
      if (chunk.error) {
        alert("Error from backend: " + chunk.error);
        return;
      }

      // Check if this chunk contains the chat ID
      if (chunk.chatId) {
        newChat.chatId = chunk.chatId;
      }

      // Construct the new chat entry
      newChat = {
        ...newChat,
        reply: newChat.reply + chunk.token,
      };

      // Trigger a re-render
      setStreamingChat(newChat);
    });

    // Stream is finished, so add the chat to the list
    setStreamingChat(undefined);
    setChats((prev) => [...prev, newChat]);
  };

  return (
    <>
      <h1>TokenBase</h1>
      <div>
        <ChatArea chats={chats} streamingChat={streamingChat} />
        <PromptArea onSend={onPromptSend} />
      </div>
    </>
  );
};

export default Index;
