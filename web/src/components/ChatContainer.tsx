import styles from "@/styles/components/ChatContainer.module.scss";
import React, { useState } from "react";
import PromptArea from "@/components/PromptArea";
import ChatToken from "@/models/ChatToken";
import ChatError from "@/models/ChatError";
import Chat from "@/components/Chat";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import { recvHttpStream } from "@/utils/recvHttpStream";

type ChatContainerProps = {
  endpoint: string;
  constructRequest: (prompt: string) => any;
  onSend: () => Promise<string | undefined>;
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
  const [error, setError] = useState<string | null>(null);

  const onPromptSend = async (prompt: string) => {
    // Clear any previous error
    setError(null);

    // Scroll to the bottom of the chat
    scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });

    {
      // Call the provided callback
      const err = await onSend();

      if (err) {
        setError(err);
        setLoading(false);
        return;
      }
    }

    // Initialize a new chat entry
    let newChat: ChatState = {
      prompt: prompt,
      replyTokens: [],
    };

    // Set loading state and show the new chat entry prompt
    setLoading(true);
    setStreamingChat(newChat);

    // Construct the request using the provided callback
    const req = constructRequest(prompt);

    // Send the prompt to the backend
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      setError("Failed to send prompt to backend");
      setLoading(false);
      return;
    }

    // Stream the response
    await recvHttpStream(res, (chunk: ChatToken & ChatError) => {
      // Check if this chunk is an error
      // Alert for now...
      if (chunk.error) {
        setError(chunk.error);
        setLoading(false);
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
          {chats.length > 0 || streamingChat ? (
            chats.map((chat) => (
              <Chat
                key={chat.chatId}
                chatId={chat.chatId ?? -1}
                prompt={chat.prompt}
                replyTokens={chat.replyTokens}
                isComplete={true}
              />
            ))
          ) : (
            <div className={styles.emptyChat}>
              <h2>What's Up?</h2>
            </div>
          )}

          {/* If a chat reply is being streamed back, render it here */}
          {streamingChat && (
            <Chat
              key={streamingChat.chatId ?? -1}
              chatId={streamingChat.chatId ?? -1}
              prompt={streamingChat.prompt}
              replyTokens={streamingChat.replyTokens}
              isComplete={false}
            />
          )}
        </div>
        {error ? (
          <ErrorMessage error={error} />
        ) : (
          isLoading && <LoadingIndicator />
        )}
      </div>
      <PromptArea
        onSend={onPromptSend}
        isDisabled={isLoading || streamingChat != null || error != null}
      />
    </div>
  );
};

export default ChatContainer;
