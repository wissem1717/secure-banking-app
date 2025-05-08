import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface userData {
  token: string,
  id: string,
  role: string
}

const AuthContext = createContext<{ user: userData | null; login: (data: null | userData) => void; logout: () => void; }>(
    { user: null, login: async () => {}, logout: () => {}}
);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser]: [null | userData, React.Dispatch<null | userData>] = useLocalStorage("user", null);

  // call this function when you want to authenticate the user
  const login = (data: null | userData) => {
    setUser(data);
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};