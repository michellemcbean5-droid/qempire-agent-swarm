import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface ClientSession {
  email: string;
  packageId: string;
  businessName: string;
}

interface AuthContextType {
  session: ClientSession | null;
  setSession: (session: ClientSession | null) => void;
  login: (email: string, packageId: string, businessName: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ClientSession | null>(() => {
    const stored = localStorage.getItem("qempire_session");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, packageId: string, businessName: string) => {
    const newSession = { email, packageId, businessName };
    setSession(newSession);
    localStorage.setItem("qempire_session", JSON.stringify(newSession));
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem("qempire_session");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        setSession,
        login,
        logout,
        isAuthenticated: session !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
