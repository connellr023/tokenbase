import styles from "@/styles/components/ChatContainer.module.scss";
import React, { useState } from "react";
import PromptArea from "@/components/PromptArea";
import ChatToken from "@/models/ChatToken";
import ChatError from "@/models/ChatError";
import ChatRecord from "@/models/ChatRecord";
import Chat from "@/components/Chat";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import { recvHttpStream } from "@/utils/recvHttpStream";
import TypesetRenderer from "./TypesetRenderer";

type HttpChatRequest = {
  headers?: HeadersInit;
  body?: string;
};

type ChatContainerProps = {
  endpoint: string;
  constructRequest: (prompt: string) => HttpChatRequest;
  onSend: () => Promise<string | undefined>;
};

const ChatContainer: React.FC<ChatContainerProps> = ({
  endpoint,
  constructRequest,
  onSend,
}) => {
  const [chats, setChats] = useState<ChatRecord[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [streamingChat, setStreamingChat] = useState<ChatRecord | null>(null);
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
    let newChat: ChatRecord = {
      prompt: prompt,
      reply: "",
    };

    // Set loading state and show the new chat entry prompt
    setLoading(true);
    setStreamingChat(newChat);

    // Construct the request using the provided callback
    const { headers, body } = constructRequest(prompt);

    // Send the prompt to the backend
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
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
        reply: newChat.reply + chunk.token,
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
                reply={chat.reply}
                isComplete={true}
              />
            ))
          ) : (
            <div className={styles.emptyChat}>
              <TypesetRenderer>
                {
                  "Enter a prompt to get started. Write **Markdown** or $\\textbf{LaTeX}$ for formatting."
                }
              </TypesetRenderer>
            </div>
          )}

          {/* If a chat reply is being streamed back, render it here */}
          {streamingChat && (
            <Chat
              key={streamingChat.chatId ?? -1}
              chatId={streamingChat.chatId ?? -1}
              prompt={streamingChat.prompt}
              reply={streamingChat.reply}
              isComplete={false}
            />
          )}
        </div>
        {error ? (
          <ErrorMessage error={error} />
        ) : (
          isLoading && (
            <div className={styles.loadingIndicatorContainer}>
              {<LoadingIndicator />}
            </div>
          )
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
