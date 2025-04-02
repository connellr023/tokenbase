import { useBearerContext } from "./BearerContext";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type HomeModalContextType = {
  isOpen: boolean;
  close: () => void;
  isRenameModalOpen: boolean;
  openRenameModal: (conversationId: string) => void;
  closeRenameModal: () => void;
  renameConversationId: string | null;
};

const HomeModalContext = createContext<HomeModalContextType | null>(null);

export const HomeModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { bearer } = useBearerContext();
  const [isOpen, setOpen] = useState(true);

  const [isRenameModalOpen, setRenameModalOpen] = useState(false);
  const [renameConversationId, setRenameConversation] = useState<string | null>(null);

  const close = useCallback(() => setOpen(false), []);

  const openRenameModal = useCallback((conversationId: string) => {
    setRenameConversation(conversationId);
    setRenameModalOpen(true);
  }, []);

  const closeRenameModal = useCallback(() => {
    setRenameModalOpen(false);
    setRenameConversation(null);
  }, []);

  useEffect(() => {
    if (bearer) {
      setOpen(false);
    }
  }, [bearer]);

  return (
    <HomeModalContext.Provider 
      value={{ 
        isOpen,
        close,
        isRenameModalOpen,
        openRenameModal,
        closeRenameModal,
        renameConversationId,
      }}>
      {children}
    </HomeModalContext.Provider>
  );
};

export const useHomeModalContext = () => {
  const context = useContext(HomeModalContext);

  if (!context) {
    throw new Error("useHomeModal must be used within a HomeModalProvider");
  }

  return context;
};
