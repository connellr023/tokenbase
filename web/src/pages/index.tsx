import ChatArea from "@/components/ChatArea";
import PromptArea from "@/components/PromptArea";
import Message from "@/models/Message";
import {
  PostPromptTempChatRequest,
  PostPromptTempChatResponse,
} from "@/models/PostPromptTempChat";
import { backendEndpoint } from "@/utils/constants";
import { useState } from "react";
import { streamResponse } from "@/utils/streamResponse";

const Index: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const onPromptSend = async (prompt: string) => {
    // Construct the request
    const req: PostPromptTempChatRequest = {
      chatId: "nothingfornow",
      prompt,
    };

    // Send the prompt to the backend
    const res = await fetch(backendEndpoint + "api/chat/temp/prompt", {
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
    const newMessage: Message = {
      id: Date.now().toString(),
      prompt: req.prompt,
      reply: "",
    };

    // Add the new chat entry to the state
    setMessages((prevChats) => [...prevChats, newMessage]);

    // Stream the response
    await streamResponse(res, (chunk: PostPromptTempChatResponse) => {
      // Update the chat entry with the new token
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === newMessage.id
            ? { ...message, reply: message.reply + chunk.token }
            : message
        )
      );
    });
  };

  return (
    <>
      <h1>TokenBase</h1>
      <div>
        <ChatArea messages={messages} />
        <PromptArea onSend={onPromptSend} />
      </div>
    </>
  );
};

export default Index;
