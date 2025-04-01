import User from "@/models/User";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const localStorageBearerKey = "bearer";

export type Bearer = {
  token: string;
  user?: User;
};

type BearerContextType = {
  bearer?: Readonly<Bearer>;
  setBearer: (bearer: Bearer) => void;
  clearBearer: () => void;
};

const BearerContext = createContext<BearerContextType | null>(null);

export const BearerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bearer, setBearerState] = useState<Bearer | undefined>(undefined);

  const setBearer = useCallback((newBearer: Bearer) => {
    setBearerState(newBearer);

    // Only store in local storage if the token belongs to a user (not a guest)
    if (newBearer.user) {
      localStorage.setItem(localStorageBearerKey, JSON.stringify(newBearer));
    }
  }, []);

  const clearBearer = useCallback(() => {
    setBearerState(undefined);
    localStorage.removeItem(localStorageBearerKey);
  }, []);

  // Retrieve bearer from local storage on mount
  useEffect(() => {
    const bearerString = localStorage.getItem(localStorageBearerKey);

    if (bearerString) {
      setBearerState(JSON.parse(bearerString) as Bearer);
    }
  }, []);

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
      "useBearerContext must be used within a BearerContextProvider",
    );
  }

  return context;
};
