import ModelInfo from "@/models/ModelInfo";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type ModelsContextType = {
  availableModels: Readonly<ModelInfo[]>;
  selectedModelIndex: number;
  setSelectedModel: Dispatch<SetStateAction<number>>;
};

const ModelsContext = createContext<ModelsContextType | null>(null);

type ModelsProviderProps = {
  availableModels: ModelInfo[];
  children: ReactNode;
};

export const ModelsProvider: React.FC<ModelsProviderProps> = ({
  availableModels,
  children,
}) => {
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);

  return (
    <ModelsContext.Provider
      value={{
        availableModels,
        selectedModelIndex,
        setSelectedModel: setSelectedModelIndex,
      }}
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
