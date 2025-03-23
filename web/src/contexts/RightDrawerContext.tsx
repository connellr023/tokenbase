import { createContext, useContext, useState, ReactNode } from "react";

type RightDrawerContextType = {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const RightDrawerContext = createContext<RightDrawerContextType | null>(null);

export const RightDrawerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <RightDrawerContext.Provider
      value={{ isDrawerOpen: isOpen, openDrawer, closeDrawer }}
    >
      {children}
    </RightDrawerContext.Provider>
  );
};

export const useRightDrawerContext = () => {
  const context = useContext(RightDrawerContext);

  if (!context) {
    throw new Error(
      "useRightDrawerContext must be used within a RightDrawerProvider"
    );
  }

  return context;
};
