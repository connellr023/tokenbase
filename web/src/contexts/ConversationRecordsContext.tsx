import Conversation from "@/models/Conversation";
import { reqAllConversations } from "@/utils/reqAllConversations";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useBearerContext } from "./BearerContext";

type ConversationRecordsContextType = {
  selectedConversationIndex: number | null;
  selectConversation: (index: number) => void;
  unselectConversation: () => void;
  conversationRecords: Readonly<Conversation[]> | null;
  setConversationRecords: (conversations: Conversation[]) => void;
  clearConversationRecords: () => void;
};

const ConversationRecordsContext =
  createContext<ConversationRecordsContextType | null>(null);

export const ConversationRecordsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { bearer } = useBearerContext();
  const [selectedConversationIndex, setSelectedConversationIndex] = useState<
    number | null
  >(null);
  const [conversationRecords, setConversationRecordsState] = useState<
    Conversation[] | null
  >([]);

  const clearConversationRecords = () => setConversationRecordsState([]);

  const setConversationRecords = (conversations: Conversation[]) =>
    setConversationRecordsState(conversations);

  const selectConversation = (index: number) =>
    setSelectedConversationIndex(index);

  const unselectConversation = () => setSelectedConversationIndex(null);

  useEffect(() => {
    if (!bearer) {
      return;
    }

    const getAllConversations = async () => {
      const conversations = await reqAllConversations(bearer.token);
      setConversationRecordsState(conversations);
    };

    getAllConversations();
  }, [bearer]);

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
      "useConversationRecords must be used within a ConversationRecordsProvider",
    );
  }

  return context;
};
