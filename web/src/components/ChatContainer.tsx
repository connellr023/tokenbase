import styles from "@/styles/components/ChatContainer.module.scss";
import PromptArea from "@/components/PromptArea";
import ChatToken from "@/models/ChatToken";
import ChatError from "@/models/ChatError";
import ChatRecord from "@/models/ChatRecord";
import Chat from "@/components/Chat";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import TypesetRenderer from "./TypesetRenderer";
import StandardButton from "./StandardButton";
import Result from "@/utils/result";
import { useEffect, useRef, useState } from "react";
import { recvHttpStream } from "@/utils/recvHttpStream";
import { useChatRecordsContext } from "@/contexts/ChatRecordsContext";
import { useBearerContext } from "@/contexts/BearerContext";
import { useConversationRecordsContext } from "@/contexts/ConversationRecordsContext";

type HttpChatReq = {
  headers?: HeadersInit;
  body?: string;
};

type ChatContainerProps = {
  promptEndpoint: string;
  deleteEndpoint: string;
  suggestions: string[];
  constructPromptRequest: (prompt: string) => Promise<Result<HttpChatReq>>;
  constructDeleteRequest: (createdAt: number) => Promise<Result<HttpChatReq>>;
};

const ChatContainer: React.FC<ChatContainerProps> = ({
  promptEndpoint,
  deleteEndpoint,
  suggestions,
  constructPromptRequest,
  constructDeleteRequest,
}) => {
  const { chats, setChats } = useChatRecordsContext();
  const { bearer } = useBearerContext();
  const [isLoading, setLoading] = useState(false);
  const [streamingChat, setStreamingChat] = useState<ChatRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortPrompt = useRef<(() => void) | null>(null);
  const loadingIndicatorRef = useRef<HTMLDivElement | null>(null);

  const onPromptSend = async (prompt: string) => {
    // Clear any previous error
    setError(null);

    // Initialize a new chat entry
    let newChat: ChatRecord = {
      prompt: prompt,
      reply: "",
    };

    // Set loading state and show the new chat entry prompt
    setLoading(true);
    setStreamingChat(newChat);

    // Construct the request using the provided callback
    const { ok, error } = await constructPromptRequest(prompt);

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    // Create an abort controller to cancel the request
    const controller = new AbortController();
    abortPrompt.current = () => controller.abort();

    try {
      // Send the prompt to the backend
      const res = await fetch(promptEndpoint, {
        method: "POST",
        signal: controller.signal,
        ...ok,
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

          // Check if this chunk contains the timestamp
          if (chunk.createdAt) {
            newChat.createdAt = chunk.createdAt;
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

      // Add the chat to the list if it has a timestamp
      if (newChat.createdAt) {
        setChats((prev) => [...prev, newChat]);
      }
    }, 200);
  };

  const onChatDelete = async (chatCreatedAt: number) => {
    // Clear any previous error
    setError(null);

    // Construct the request using the provided callback
    const { ok, error } = await constructDeleteRequest(chatCreatedAt);

    if (error) {
      setError(error);
      return;
    }

    try {
      // Send the delete request to the backend
      const res = await fetch(deleteEndpoint, {
        method: "DELETE",
        ...ok,
      });

      if (!res.ok) {
        setError("Failed to delete chat from backend");
        return;
      }

      // Remove the chat from the list
      setChats((prev) =>
        prev.filter((chat) => chat.createdAt !== chatCreatedAt)
      );
    } catch {
      setError("Failed to send delete request to backend");
    }
  };

  useEffect(() => {
    if (loadingIndicatorRef.current) {
      loadingIndicatorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLoading]);

  return (
    <div className={styles.container}>
      {chats.length === 0 && !streamingChat ? (
        <div className={styles.emptyChat}>
          {/* Render a welcome message if there are no chats */}
          {bearer?.user && (
            <div className={styles.greetingContainer}>
              Welcome back, {bearer.user.username}...
            </div>
          )}
          <TypesetRenderer>
            {
              "Enter a prompt to get started. Write **Markdown** and $\\LaTeX$ for formatting."
            }
          </TypesetRenderer>
          <div className={styles.suggestionsContainer}>
            {/* Render some random chat suggestions */}
            {suggestions?.map((suggestion, i) => (
              <StandardButton key={i} onClick={() => onPromptSend(suggestion)}>
                {suggestion}
              </StandardButton>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.chatContainer}>
          <div>
            {/* Render all finished chats */}
            {chats.map((chat, i) => (
              <Chat
                key={i}
                createdAt={chat.createdAt ?? -1}
                prompt={chat.prompt}
                reply={chat.reply}
                isComplete={true}
                onDelete={onChatDelete}
              />
            ))}

            {/* If a chat reply is being streamed back, render it here */}
            {streamingChat && (
              <Chat
                createdAt={streamingChat.createdAt ?? -1}
                prompt={streamingChat.prompt}
                reply={streamingChat.reply}
                isComplete={false}
              />
            )}

            {error ? (
              <ErrorMessage error={error} />
            ) : (
              isLoading && (
                <div
                  className={styles.loadingIndicatorContainer}
                  ref={loadingIndicatorRef}
                >
                  {<LoadingIndicator />}
                </div>
              )
            )}
          </div>
        </div>
      )}

      <PromptArea
        isDisabled={error != null}
        onSend={onPromptSend}
        canAttach={!streamingChat}
        canCancel={(isLoading || streamingChat != null) && !error}
        onCancel={() => abortPrompt.current?.()}
      />
    </div>
  );
};

export default ChatContainer;
