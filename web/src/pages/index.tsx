import ChatArea from "@/components/ChatArea";
import PromptArea from "@/components/PromptArea";
import Chat from "@/models/Chat";
import { useState } from "react";

const Index: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);

  const onPromptSend = (prompt: string) => {
    // console.log(prompt);
    // setChats((prevChats) => [
    //   ...prevChats,
    //   {
    //     id: prevChats.length + 1,
    //     prompt,
    //     reply: "Hello!",
    //   },
    // ]);
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
