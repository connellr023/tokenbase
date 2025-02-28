import React, { useState } from "react";
import ChatArea from "@/components/ChatArea";
import PromptArea from "@/components/PromptArea";
import ChatRecord from "@/models/ChatRecord";
import ChatToken from "@/models/ChatToken";
import ChatError from "@/models/ChatError";
import { recvHttpStream } from "@/utils/recvHttpStream";

type ChatContainerProps = {
  endpoint: string;
  constructRequest: (prompt: string) => any;
  onSend: () => Promise<void>;
};

const ChatContainer: React.FC<ChatContainerProps> = ({
  endpoint,
  constructRequest,
  onSend,
}) => {
  const [chats, setChats] = useState<ChatRecord[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [streamingChat, setStreamingChat] = useState<ChatRecord | undefined>(
    undefined,
  );

  const onPromptSend = async (prompt: string) => {
    // Call the provided callback
    await onSend();

    // Construct the request using the provided callback
    const req = constructRequest(prompt);

    // Set loading indicator
    setLoading(true);

    // Send the prompt to the backend
    const res = await fetch(endpoint, {
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
      setLoading(false);
    });

    // Stream is finished, so add the chat to the list
    setStreamingChat(undefined);
    setChats((prev) => [...prev, newChat]);
  };

  return (
    <>
      <ChatArea chats={chats} streamingChat={streamingChat} />
      {isLoading && <div>Loading...</div>}
      <PromptArea onSend={onPromptSend} />
    </>
  );
};

export default ChatContainer;
