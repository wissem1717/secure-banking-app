import { createContext, useContext, useMemo } from "react"; // création d’un contexte React
import { useLocalStorage } from "./useLocalStorage"; // hook personnalisé pour stocker dans localStorage

interface userData { // structure des données utilisateur
  token: string, // jeton JWT
  id: string, // identifiant de l'utilisateur
  role: string // rôle : "user" ou "employee"
}

const AuthContext = createContext<{ user: userData | null; login: (data: null | userData) => void; logout: () => void; }>(
    { user: null, login: async () => {}, logout: () => {}} // valeur par défaut si non fourni
);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser]: [null | userData, React.Dispatch<null | userData>] = useLocalStorage("user", null); // utilisateur stocké dans le localStorage

  // call this function when you want to authenticate the user
  const login = (data: null | userData) => { // fonction pour se connecter
    setUser(data); // on stocke l'utilisateur dans localStorage
  };

  // call this function to sign out logged in user
  const logout = () => { // fonction pour se déconnecter
    setUser(null); // on supprime l'utilisateur du localStorage
  };

  const value = useMemo( // mémorise le contexte (évite recalcul inutile)
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; // exporte le contexte à tous les enfants
};

export const useAuth = () => { // hook personnalisé pour utiliser l'auth dans les composants
  return useContext(AuthContext); // accès au contexte global
};
