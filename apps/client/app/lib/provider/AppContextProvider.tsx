'use client';
import { GetUserAPIResponse } from '@repo/shared';
import React from 'react';

type AppContextType = {
  user: GetUserAPIResponse | null;
  handleSetUser: (user: GetUserAPIResponse) => void;
};

const AppContext = React.createContext<AppContextType>({
  user: null,
  handleSetUser: () => {},
});

export const useAppContext = () => React.useContext(AppContext);
export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<GetUserAPIResponse | null>(null);

  const handleSetUser = (user: GetUserAPIResponse) => {
    setUser(user);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        handleSetUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
