'use client';
import { GetUserAPIResponse } from '@repo/shared';
import React from 'react';

type AppContextType = {
  user: GetUserAPIResponse;
  handleSetUser: (user: GetUserAPIResponse) => void;
};

const AppContext = React.createContext<AppContextType>({
  user: {} as GetUserAPIResponse,
  handleSetUser: () => {},
});

export const useAppContext = () => React.useContext(AppContext);
export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<GetUserAPIResponse>(
    {} as GetUserAPIResponse
  );

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
