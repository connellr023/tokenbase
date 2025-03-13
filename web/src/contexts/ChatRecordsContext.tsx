import ChatRecord from "@/models/ChatRecord";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type ChatRecordsContextType = {
  chats: ChatRecord[];
  setChats: Dispatch<SetStateAction<ChatRecord[]>>;
};

const ChatRecordsContext = createContext<ChatRecordsContextType | null>(null);

export const ChatRecordsContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [chats, setChats] = useState<ChatRecord[]>([]);

  return (
    <ChatRecordsContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatRecordsContext.Provider>
  );
};

export const useChatRecordsContext = () => {
  const context = useContext(ChatRecordsContext);

  if (!context) {
    throw new Error(
      "useChatRecordsContext must be used within a ChatRecordsContextProvider",
    );
  }

  return context;
};
