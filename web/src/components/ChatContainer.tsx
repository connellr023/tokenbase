import styles from "@/styles/components/ChatContainer.module.scss";
import React, { useRef, useState } from "react";
import PromptArea from "@/components/PromptArea";
import ChatToken from "@/models/ChatToken";
import ChatError from "@/models/ChatError";
import ChatRecord from "@/models/ChatRecord";
import Chat from "@/components/Chat";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import TypesetRenderer from "./TypesetRenderer";
import { recvHttpStream } from "@/utils/recvHttpStream";
import StandardButton from "./StandardButton";

type HttpChatRequest = {
  headers?: HeadersInit;
  body?: string;
};

type ChatContainerProps = {
  promptEndpoint: string;
  deleteEndpoint: string;
  suggestions: string[];
  constructPromptRequest: (prompt: string) => HttpChatRequest;
  constructDeleteRequest: (chatId: number) => HttpChatRequest;
  onSend: () => Promise<string | undefined>;
};

const ChatContainer: React.FC<ChatContainerProps> = ({
  promptEndpoint,
  deleteEndpoint,
  suggestions,
  constructPromptRequest,
  constructDeleteRequest,
  onSend,
}) => {
  const [chats, setChats] = useState<ChatRecord[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [streamingChat, setStreamingChat] = useState<ChatRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortPrompt = useRef<(() => void) | null>(null);

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
    const { headers, body } = constructPromptRequest(prompt);

    // Create an abort controller to cancel the request
    const controller = new AbortController();
    abortPrompt.current = () => controller.abort();

    try {
      // Send the prompt to the backend
      const res = await fetch(promptEndpoint, {
        method: "POST",
        headers,
        body,
        signal: controller.signal,
      });

      if (!res.ok) {
        setError("Failed to send prompt to backend");
        setLoading(false);
        return;
      }

      // Stream the response
      await recvHttpStream<ChatToken & ChatError>(
        res,
        controller.signal,
        (chunk) => {
          // Check if this chunk is an error
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
        }
      );
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError("Failed to receive response from backend");
      }

      setLoading(false);
    } finally {
      // Clear the abort callback
      abortPrompt.current = null;
    }

    // Delay to let animation finish
    setTimeout(() => {
      // Stream is finished, so add the chat to the list
      setStreamingChat(null);

      // Add the chat to the list if it has a chat ID
      if (newChat.chatId) {
        setChats((prev) => [...prev, newChat]);
      }
    }, 200);
  };

  const onChatDelete = async (chatId: number) => {
    // Clear any previous error
    setError(null);

    // Construct the request using the provided callback
    const { headers, body } = constructDeleteRequest(chatId);

    try {
      // Send the delete request to the backend
      const res = await fetch(deleteEndpoint, {
        method: "DELETE",
        headers,
        body,
      });

      if (!res.ok) {
        setError("Failed to delete chat from backend");
        return;
      }

      // Remove the chat from the list
      setChats((prev) => prev.filter((chat) => chat.chatId !== chatId));
    } catch {
      setError("Failed to send delete request to backend");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        <div>
          {/* Render all finished chats */}
          {chats.length > 0 || streamingChat
            ? chats.map((chat) => (
                <Chat
                  key={chat.chatId}
                  chatId={chat.chatId ?? -1}
                  prompt={chat.prompt}
                  reply={chat.reply}
                  isComplete={true}
                  onDelete={onChatDelete}
                />
              ))
            : !error && (
                <div className={styles.emptyChat}>
                  <TypesetRenderer>
                    {
                      "Enter a prompt to get started. Write **Markdown** and $\\LaTeX$ for formatting."
                    }
                  </TypesetRenderer>
                  <div className={styles.suggestionsContainer}>
                    {/* Render some random chat suggestions */}
                    {suggestions?.map((suggestion, i) => (
                      <StandardButton
                        key={i}
                        onClick={() => onPromptSend(suggestion)}
                      >
                        {suggestion}
                      </StandardButton>
                    ))}
                  </div>
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
        isDisabled={error != null}
        canCancel={(isLoading || streamingChat != null) && !error}
        onCancel={() => abortPrompt.current?.()}
      />
    </div>
  );
};

export default ChatContainer;
