import { createContext, ReactNode, useContext, useState } from "react";

type HomeModalContextType = {
  isOpen: boolean;
  close: () => void;
};

const HomeModalContext = createContext<HomeModalContextType | null>(null);

export const HomeModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setOpen] = useState(true);

  return (
    <HomeModalContext.Provider value={{ isOpen, close: () => setOpen(false) }}>
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
