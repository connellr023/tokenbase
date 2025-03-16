import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type ModelsContextType = {
  availableModels: string[];
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
};

const ModelsContext = createContext<ModelsContextType | null>(null);

type ModelsProviderProps = {
  availableModels: string[];
  children: React.ReactNode;
};

export const ModelsProvider: React.FC<ModelsProviderProps> = ({
  availableModels,
  children,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <ModelsContext.Provider
      value={{ availableModels, selectedIndex, setSelectedIndex }}
    >
      {children}
    </ModelsContext.Provider>
  );
};

export const useModelsContext = (): ModelsContextType => {
  const context = useContext(ModelsContext);

  if (!context) {
    throw new Error("useModelsContext must be used within a ModelsProvider");
  }

  return context;
};
