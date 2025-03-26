import Conversation from "@/models/Conversation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type ConversationRecordsContextType = {
  selectedConversationIndex: number | null;
  selectConversation: (index: number) => void;
  unselectConversation: () => void;
  conversationRecords: Readonly<Conversation[]> | null;
  setConversationRecords: Dispatch<SetStateAction<Conversation[] | null>>;
  clearConversationRecords: () => void;
};

const ConversationRecordsContext =
  createContext<ConversationRecordsContextType | null>(null);

export const ConversationRecordsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedConversationIndex, setSelectedConversationIndex] = useState<
    number | null
  >(null);
  const [conversationRecords, setConversationRecords] = useState<
    Conversation[] | null
  >([]);

  const clearConversationRecords = () => setConversationRecords([]);

  const selectConversation = (index: number) =>
    setSelectedConversationIndex(index);

  const unselectConversation = () => setSelectedConversationIndex(null);

  return (
    <ConversationRecordsContext.Provider
      value={{
        selectedConversationIndex,
        selectConversation,
        unselectConversation,
        conversationRecords,
        setConversationRecords,
        clearConversationRecords,
      }}
    >
      {children}
    </ConversationRecordsContext.Provider>
  );
};

export const useConversationRecordsContext = () => {
  const context = useContext(ConversationRecordsContext);

  if (!context) {
    throw new Error(
      "useConversationRecords must be used within a ConversationRecordsProvider"
    );
  }

  return context;
};
