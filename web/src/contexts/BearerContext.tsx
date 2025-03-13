import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export enum BearerVariant {
  Admin,
  User,
  Guest,
}

export type Bearer = {
  variant: BearerVariant;
  token: string;
  data?: any;
};

type BearerContextType = {
  bearer?: Bearer;
  setBearer: Dispatch<SetStateAction<Bearer | undefined>>;
  clearBearer: () => void;
};

const BearerContext = createContext<BearerContextType | null>(null);

export const BearerContextProvider: React.FC<{ children: React.ReactNode }> = ({
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
