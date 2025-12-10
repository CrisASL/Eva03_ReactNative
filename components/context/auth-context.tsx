import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextProps {
  email: string | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        const storedEmail = await AsyncStorage.getItem("userEmail");

        if (storedToken && storedEmail) {
          setToken(storedToken);
          setEmail(storedEmail);
        }
      } catch (e) {
        console.error("Failed to load auth data", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (userEmail: string, userToken: string) => {
    setEmail(userEmail);
    setToken(userToken);
    await AsyncStorage.setItem("userToken", userToken);
    await AsyncStorage.setItem("userEmail", userEmail);
  };

  const logout = async () => {
    setEmail(null);
    setToken(null);
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userEmail");
  };

  return (
    <AuthContext.Provider value={{ email, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };

