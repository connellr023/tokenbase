import ChatRecord from "@/models/ChatRecord";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type ChatRecordsContextType = {
  chats: Readonly<ChatRecord[]>;
  setChats: Dispatch<SetStateAction<ChatRecord[]>>;
  clearChats: () => void;
};

const ChatRecordsContext = createContext<ChatRecordsContextType | null>(null);

export const ChatRecordsProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [chats, setChats] = useState<ChatRecord[]>([]);
  const clearChats = () => setChats([]);

  return (
    <ChatRecordsContext.Provider value={{ chats, setChats, clearChats }}>
      {children}
    </ChatRecordsContext.Provider>
  );
};

export const useChatRecordsContext = () => {
  const context = useContext(ChatRecordsContext);

  if (!context) {
    throw new Error(
      "useChatRecordsContext must be used within a ChatRecordsContextProvider"
    );
  }

  return context;
};
