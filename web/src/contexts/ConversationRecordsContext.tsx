import ConversationRecord from "@/models/ConversationRecord";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type ConversationRecordsContextType = {
  conversationRecords: ConversationRecord[];
  setConversationRecords: Dispatch<SetStateAction<ConversationRecord[]>>;
  clearConversationRecords: () => void;
};

const ConversationRecordsContext =
  createContext<ConversationRecordsContextType | null>(null);

export const ConversationRecordsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [conversationRecords, setConversationRecords] = useState<
    ConversationRecord[]
  >([]);

  const clearConversationRecords = () => setConversationRecords([]);

  return (
    <ConversationRecordsContext.Provider
      value={{
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
      "useConversationRecords must be used within a ConversationRecordsProvider",
    );
  }

  return context;
};
