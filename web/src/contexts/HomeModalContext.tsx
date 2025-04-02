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
};

const HomeModalContext = createContext<HomeModalContextType | null>(null);

export const HomeModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { bearer } = useBearerContext();
  const [isOpen, setOpen] = useState(true);

  const close = useCallback(() => setOpen(false), []);


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
