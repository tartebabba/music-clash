import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { User } from './types';


interface UserContextType {
  user: User | null; // It can be replaced with more complex user type
  setUser: (user: User | null) => void;
}

const UserContext = createContext<
  UserContextType | undefined
>(undefined);

// userProvider Component
export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// useContext Component
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      'useUser must be used within a UserProvider'
    );
  }
  return context;
};
