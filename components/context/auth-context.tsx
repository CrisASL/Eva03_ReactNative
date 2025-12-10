import React, { createContext, ReactNode, useState } from "react";

interface AuthContextProps {
  email: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [email, setEmail] = useState<string | null>(null);

  const login = (userEmail: string) => {
    setEmail(userEmail);
  };

  const logout = () => {
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };

