import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface SessionData {
  taskIds: string[];
  email: string;
  businessName: string;
  packageId: string;
}

interface AuthContextType {
  session: SessionData | null;
  setSession: (data: SessionData) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "qempire_session";

function loadSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<SessionData | null>(loadSession);

  const setSession = useCallback((data: SessionData) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    setSessionState(data);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSessionState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
