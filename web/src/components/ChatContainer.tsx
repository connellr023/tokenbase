import styles from "@/styles/components/ChatContainer.module.scss";
import React, { useState } from "react";
import PromptArea from "@/components/PromptArea";
import ChatToken from "@/models/ChatToken";
import ChatError from "@/models/ChatError";
import Chat from "@/components/Chat";
import LoadingIndicator from "@/components/LoadingIndicator";
import { recvHttpStream } from "@/utils/recvHttpStream";

type ChatContainerProps = {
  endpoint: string;
  constructRequest: (prompt: string) => any;
  onSend: () => Promise<void>;
};

type ChatState = {
  chatId?: number;
  prompt: string;
  replyTokens: string[];
};

const ChatContainer: React.FC<ChatContainerProps> = ({
  endpoint,
  constructRequest,
  onSend,
}) => {
  const [chats, setChats] = useState<ChatState[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [streamingChat, setStreamingChat] = useState<ChatState | null>(null);

  const onPromptSend = async (prompt: string) => {
    // Call the provided callback
    await onSend();

    // Construct the request using the provided callback
    const req = constructRequest(prompt);

    // Initialize a new chat entry
    let newChat: ChatState = {
      prompt: prompt,
      replyTokens: [],
    };

    // Set loading state and show the new chat entry prompt
    setLoading(true);
    setStreamingChat(newChat);

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
        replyTokens: [...newChat.replyTokens, chunk.token],
      };

      // Trigger a re-render
      setStreamingChat(newChat);
      setLoading(false);
    });

    // Delay to let animation finish
    setTimeout(() => {
      // Stream is finished, so add the chat to the list
      setStreamingChat(null);
      setChats((prev) => [...prev, newChat]);
    }, 200);
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        <div>
          {/* Render all finished chats */}
          {chats.map((chat) => (
            <Chat
              key={chat.chatId}
              prompt={chat.prompt}
              replyTokens={chat.replyTokens}
              shouldFadeIn={false}
            />
          ))}

          {/* If a chat reply is being streamed back, render it here */}
          {streamingChat && (
            <Chat
              key={streamingChat.chatId ?? -1}
              prompt={streamingChat.prompt}
              replyTokens={streamingChat.replyTokens}
              shouldFadeIn={true}
            />
          )}
        </div>
      </div>
      {isLoading && <LoadingIndicator />}
      <PromptArea onSend={onPromptSend} />
    </div>
  );
};

export default ChatContainer;
