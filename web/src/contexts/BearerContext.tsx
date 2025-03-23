import { User, UserVariant } from "@/models/User";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type Bearer = {
  variant: UserVariant;
  token: string;
  data?: User;
};

type BearerContextType = {
  bearer?: Readonly<Bearer>;
  setBearer: Dispatch<SetStateAction<Bearer | undefined>>;
  clearBearer: () => void;
};

const BearerContext = createContext<BearerContextType | null>(null);

export const BearerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bearer, setBearer] = useState<Bearer | undefined>(undefined);
  const clearBearer = () => setBearer(undefined);

  return (
    <BearerContext.Provider value={{ bearer, setBearer, clearBearer }}>
      {children}
    </BearerContext.Provider>
  );
};

export const useBearerContext = () => {
  const context = useContext(BearerContext);

  if (!context) {
    throw new Error(
      "useBearerContext must be used within a BearerContextProvider"
    );
  }

  return context;
};
