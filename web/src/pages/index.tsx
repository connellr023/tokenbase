import ChatArea from "@/components/ChatArea";
import PromptArea from "@/components/PromptArea";
import ChatRecord from "@/models/ChatRecord";
import ChatToken from "@/models/ChatToken";
import { backendEndpoint } from "@/utils/constants";
import { useRef, useState } from "react";
import { recvHttpStream } from "@/utils/recvHttpStream";
import ChatError from "@/models/ChatError";
import { reqNewGuestSession } from "@/utils/reqNewGuestSession";

type GuestChatRequest = {
  guestSessionId: string;
  prompt: string;
};

const Index: React.FC = () => {
  const guestSessionId = useRef<string | null>(null);
  const [chats, setChats] = useState<ChatRecord[]>([]);
  const [streamingChat, setStreamingChat] = useState<ChatRecord | undefined>(
    undefined
  );

  const onPromptSend = async (prompt: string) => {
    // Obtain a new guest session ID if we don't have one
    if (!guestSessionId.current) {
      const id = await reqNewGuestSession();

      // Alert for now...
      if (!id) {
        alert("Failed to obtain a guest session ID");
        return;
      }

      guestSessionId.current = id;
    }

    // Construct the request
    const req: GuestChatRequest = {
      guestSessionId: guestSessionId.current ?? "",
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
      // Alert for now...
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
